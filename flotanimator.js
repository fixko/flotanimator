/* jQuery Flot Animator version 1.0.

Copyright (c) 2012-2013 Chtiwi Malek
http://www.codicode.com/art/jquery_flot_animator.aspx

Licensed under Creative Commons Attribution 3.0 Unported License.

*/

$.extend({
  plotAnimator: function (chart, data,g){
    
    function fData(arr){
      var x = [];
      x.push([arr[0][0], Math.max.apply(Math, arr.map(function(i) { return i[1];}))]);
      x.push([arr[0][0], null]);
      x.push([arr[0][0], Math.min.apply(Math, arr.map(function(i) { return i[1];}))]);
      for(var i = 0; i < arr.length; i++) {
          x.push([arr[i][0], null]);
      }
      return x;
    }
    
    var serie = 0;
    for (var i = 0; i < data.length; i++)
    {
      if (data[i].animator)
      {
        serie=i;
      }
    }
    var d0 = data[serie];
    
    var oData = d0.data;
    data[serie].data = fData(oData);
    var plot = $.plot(chart, data,g);
    
    var steps = (data[serie].animator && data[serie].animator.steps) || 135;
    var duration = (data[serie].animator && data[serie].animator.duration) || 1000;
    var start = (data[serie].animator && data[serie].animator.start) || 0;
    var dir = (data[serie].animator && data[serie].animator.direction) || "right";
    function stepData()
    {
      var Si = oData[0][0];
      var Fi = oData[oData.length-1][0];
      var Pas = (Fi-Si)/steps;
      
      var d2 = [];      
      d2.push(oData[0]);
      var nPointPos = 1;
      lPoint = oData[0];
      nPoint = oData[nPointPos];
      for (var i = Si+Pas; i < Fi+Pas; i += Pas)
      {
        if (i>Fi) {i=Fi;}
        $("#m2").html(i);
        while (i > nPoint[0])
        {
          lPoint = nPoint;
          nPoint = oData[nPointPos++];
        }
        if (i == nPoint[0])
        {
          d2.push([i,nPoint[1]]);
          lPoint = nPoint;
          nPoint = oData[nPointPos++];
        }
        else
        {
          var a = ((nPoint[1]-lPoint[1]) / ((nPoint[0]-lPoint[0])));
          curV = (a * i) + (lPoint[1] - (a * lPoint[0]));
          d2.push([i,curV]);
        }
      }
      return d2;
    }
    
    var step=0;
    var sData = stepData();
    function plotData()
    {
      var d3 = [];
      for (var i = 0; i < sData.length; i++)
      {
        var ni = (dir=="right")?i:sData.length-i;
        d3.push((i<=step+1)?sData[ni]:[sData[ni][0], null]);
      }
      step++;
      data[serie].data = (step<steps) ?d3:oData;
      plot.setData(data);
      plot.draw();
      if (step<steps)
      {
        setTimeout(plotData, duration/steps);
      }
      else
      {
        chart.trigger( "animatorComplete" );
      }
    }
    setTimeout(plotData,start);
    return plot;
  }
});
