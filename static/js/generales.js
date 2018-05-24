var idiomaPaginado;
var botonesModal=[];

$(document).ready(function(){
  cleanBotonesModal(false);
});

// -------------------------------------------------------------------------------------------------- destrir tabla
function dropDataTable(tableId){ 
  $('#'+tableId).dataTable().fnDestroy();
  $('#'+tableId).children('tbody').children('tr').remove();
}

// -------------------------------------------------------------------------------------------------- destruir combo
function dropDataCombo(comboId){
  var x = document.getElementById(comboId);
  while (x.length > 0){
      x.remove(x.selectedIndex);
  }
}

// -------------------------------------------------------------------------------------------------- destruir combo
function insertarPaginado(tableId){
  $('#'+tableId).DataTable({
       'paging'       : true,
       'lengthChange' : false,
       'searching'    : false,
       'ordering'     : true,
       'info'         : true,
       'autoWidth'    : false,
       'destroy'      : true,
       "iDisplayLength": 7,
       "language"     : {  "url": window.location.origin+"/assets/fonts/SpanishT.json"  }
    });
}

// -------------------------------------------------------------------------------------------------- crear modal
function modal(tipe,size,titleMod,msg,show,close){
  switch(tipe){
    case "danger":  tipe = BootstrapDialog.TYPE_DANGER;   break;
    case "info":    tipe = BootstrapDialog.TYPE_INFO;     break;
    default:        tipe = BootstrapDialog.TYPE_DEFAULT;  break;
  }

  switch(size){
    case "large":  size = BootstrapDialog.SIZE_LARGE;   break;
    case "wide":    size = BootstrapDialog.SIZE_WIDE;   break;
  }
  
  BootstrapDialog.show({
    type: tipe,
    title: titleMod,
    size: size,
    message: function(dialogRef){
        var $message = $(msg);
        return $message;
    },
    onshown: show,
    closable: close,
    buttons: botonesModal
  });
}

// -------------------------------------------------------------------------------------------------- limpia los botones
function cleanBotonesModal(type){
  if(type){
    botonesModal=[{ 
    label: 'Cerrar',
        cssClass: 'btn-default',
        action: function(dialogItself){ dialogItself.close(); }
    }];
  }
  else{
    botonesModal=[];
  }
}

// -------------------------------------------------------------------------------------------------- Graficas (requieren sus respectivos scripts cargados antes que generales.js)
function Gpastel(type,dataGraficas,title){
  $('#graficas').append('<div id="g" style="min-width: 310px; max-width: 800px; height: 400px; margin: 0 auto; margin-top:30px;"></div>');
  Highcharts.chart('g', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: title
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: type,
            colorByPoint: true,
            data: dataGraficas
        }]
    });
}

function GbarrasH(type,data,title){
  var data2 = [];
  for (var i = 0; i < data.length; i++) {
    data2.push({'name':data[i].name,'data':[data[i].y]});
  }
  $('#graficas').append('<div id="g" style="min-width: 310px; max-width: 800px; height: auto; margin: 0 auto; margin-top:30px;"></div>');
  Highcharts.chart('g', {
        chart: {
            type: 'bar'
        },
        title: {
            text: title
        },
        xAxis: {
            categories: [title],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: type,
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: 'Solicitud/'+type
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: data2
    });
}