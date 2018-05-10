var cantHost 	= 0;
var cont_HostTB	= [];

$('#autogenSname').change(function(){
	autoName();
});
$('#cleanHostinp').change(function(){
	cleanHosts();
});
$('.ter').click(function(){
	subnetear();
	$('#tableResoult').removeClass('hidden');
});
$('.reset').click(function(){
	window.location.reload();
})

$('.add').click(function(){
	if($('#inpCant').val()!='' && $('#inpName').val()!=''){
		cont_HostTB.push({'name': $('#inpName').val(),'cant':$('#inpCant').val()});
		actualizarTabla();
		cantHost++;
		autoName();
		cleanHosts();
	}else{
		$('.alertHostTable').text('Los campos nombre subred y cantidad de hosts no deben estar vacios. ');
		$('.alertHostTable').append('<a href="#" id="a_ok" onclick="a_ok()"> OK</a>');
		$('#a_ok').removeClass('hidden');
	}
});

function a_ok(){
	$('.alertHostTable').text('');
}
function actualizarTabla(){
	dropDataTable('tbHosts');
	if(cont_HostTB.length>0)	
		$('.ter').attr('disabled',false);
	else
		$('.ter').attr('disabled',true);
	for (var i = 0; i < cont_HostTB.length; i++) {
		$('#cont_HostTB').append('<tr>'+
			'<td width="50%"><input type="text" class="form-control" placeholder="Nombre subred*" value="'+cont_HostTB[i].name+'" />'+
			'</td><td width="50%"><input type="number" class="form-control" placeholder="Cantidad de hosts*" value="'+cont_HostTB[i].cant+'" /><img src="/static/img/x.png" onclick="deleteTBH('+i+')"></td></tr>');
	}
}
function dropDataTable(tableId){ 
  $('#'+tableId).dataTable().fnDestroy();
  $('#'+tableId).children('tbody').children('tr').remove();
}

function autoName(){
	if($('#autogenSname').is(':checked'))
		$('#inpName').val('SubR'+(cantHost+1));
	else
		$('#inpName').val('');
}
function cleanHosts(){
	if($('#cleanHostinp').is(':checked'))
		$('#inpCant').val('');
	else
		$('#inpCant').val(cont_HostTB[cont_HostTB.length-1].cant);
}
function deleteTBH(index){
	cont_HostTB.splice(index,1);
	actualizarTabla();
}
function subnetear(){
	var contSubRed = [];

	for (var i = 0; i < cont_HostTB.length; i++) {
		contSubRed.push({
			'name':cont_HostTB[i].name,
			'subred':'1.1.1.1',
			'cird':'/5',
			'host':cont_HostTB[i].cant,
			'encontrados':'4',
			'rangos':'4.4.4.4 - 5.5.5.5',
			'broadcast':'123.123.123.123'
		});
	}
	for (var i = 0; i < contSubRed.length; i++) {
		
		var cont 	=	'<tr><td>'+contSubRed[i].name+'</td>';
			cont 	+=	'<td>'+contSubRed[i].subred+'</td>';
			cont 	+=	'<td>'+contSubRed[i].cird+'</td>';
			cont 	+=	'<td>'+contSubRed[i].host+'</td>';
			cont 	+=	'<td>'+contSubRed[i].encontrados+'</td>';
			cont 	+=	'<td>'+contSubRed[i].rangos+'</td>';
			cont 	+=	'<td>'+contSubRed[i].broadcast+'</td></tr>';
		$('#cont_subnet').append(cont);
	}
}