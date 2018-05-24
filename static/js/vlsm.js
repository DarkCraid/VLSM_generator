var cantHost 	= 0;
var cont_HostTB	= [];
let maxHosts 	= [{'claseC':254,'claseB':65534,'claseA':2147483648}];
let rangosRedes = [{'claseA':{'min':1,'max':126},'claseB':{'min':128,'max':191},'claseC':{'min':192,'max':223}}];
var contSubRed 	= [];

$('#autogenSname').change(function(){
	autoName();
});
$('#cleanHostinp').change(function(){
	cleanHosts();
});
$('.ter').click(function(){
	$('.add').attr('disabled',true);
	$('.ter').attr('disabled',true);
	ordenar();
	preSub();
});
$('.reset').click(function(){
	startLoader();
	setTimeout(function(){
		window.location.reload();
	},500);
})

$('.add').click(function(){
	add();
});

function add(){
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
}

$('#inpCant').keyup(function(e){
    if(e.keyCode == 13)
	    add();
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
function preSub(){
	if($('#redint').val()=='')
		alertSugerenciasRed(countHosts());
	else
		subnetear($('#redint').val());
}


function alertSugerenciasRed(totalHosts){
	var contHTML	= "";
	var contAlert 	= ["Sugerencias de redes para subnetear"];
	
	contHTML += "<p>Seleccione una red de interés, posterirmente de click a continuar para subnetear con VLSM.</p>";
	contHTML += '<br>';
	contOp	 = '';
	if(totalHosts<=maxHosts[0].claseC){
		for (var i = rangosRedes[0].claseC.min; i <= rangosRedes[0].claseC.max; i++)
			contOp += '<option value="'+i+'">'+i+'</option>';

		contHTML += '<select class="form-control octeto" id="oct1">'+contOp+'</select>';
		contOp = '';

		for(var x=2;x<4;x++){
			for (var i = 0; i <= 255; i++){
				if(i==168 && x==2)
					contOp += '<option value="'+i+'" selected>'+i+'</option>';
				else
					contOp += '<option value="'+i+'">'+i+'</option>';
			}
			contHTML += '<select class="form-control octeto" id="oct'+x+'">'+contOp+'</select>'; contOp='';
		}
		contHTML += '<select class="form-control octeto" id="oct4"><option value="0">0</option></select>';
	}
	else if(totalHosts<=maxHosts[0].claseB){
		for (var i = rangosRedes[0].claseB.min; i <= rangosRedes[0].claseB.max; i++){
				if(i==172)
					contOp += '<option value="'+i+'" selected>'+i+'</option>';
				else
					contOp += '<option value="'+i+'">'+i+'</option>';
			}

		contHTML += '<select class="form-control octeto" id="oct1">'+contOp+'</select>';
		contOp = '';

		for (var i = 0; i <= 255; i++){
				if(i==16)
					contOp += '<option value="'+i+'" selected>'+i+'</option>';
				else
					contOp += '<option value="'+i+'">'+i+'</option>';
			}
		contHTML += '<select class="form-control octeto" id="oct2">'+contOp+'</select>';
		contHTML += '<select class="form-control octeto" id="oct3"><option value="0">0</option></select>';
		contHTML += '<select class="form-control octeto" id="oct4"><option value="0">0</option></select>';
	}
	else if(totalHosts<=maxHosts[0].claseA) {
		for (var i = rangosRedes[0].claseA.min; i <= rangosRedes[0].claseA.max; i++)
			contOp += '<option value="'+i+'">'+i+'</option>';

		contHTML += '<select class="form-control octeto" id="oct1">'+contOp+'</select>';
		contOp = '';

		for (var i = 2; i <=4 ; i++)
			contHTML += '<select class="form-control octeto" id="oct'+i+'"><option value="0">0</option></select>';
	}

	cleanBotonesModal(false);
	botonesModal=[{ 
	    label: 'Continuar',
	        cssClass: 'btn-primary',
	        action: function(dialogItself){ 
	        	subnetear($('#oct1').val()+'.'+$('#oct2').val()+'.'+$('#oct3').val()+'.'+$('#oct4').val());
	        	dialogItself.close(); 
	        }
	    }];
	contAlert.push(contHTML);
	modal('info','wide',contAlert[0],contAlert[1],false,false);
}


function printSubnetTable(){
	for (var i = 0; i < contSubRed.length; i++) {	
		var cont 	=	'<tr><td>'+contSubRed[i].name+'</td>';
			cont 	+=	'<td>'+contSubRed[i].host+'</td>';
			cont 	+=	'<td>'+contSubRed[i].encontrados+'</td>';
			cont 	+=	'<td>'+contSubRed[i].subred+'</td>';
			cont 	+=	'<td>'+contSubRed[i].cird+'</td>';
			cont 	+=	'<td>'+contSubRed[i].mask+'</td>';
			cont 	+=	'<td class="text-center">'+contSubRed[i].rangos+'</td>';
			cont 	+=	'<td>'+contSubRed[i].broadcast+'</td></tr>';
		$('#cont_subnet').append(cont);
	}$('#tableResoult').removeClass('hidden');
	var grafica = []; 
	for (var i = 0; i < contSubRed.length; i++) {
		grafica.push({
			'name':contSubRed[i].name,
			'y':(parseInt(contSubRed[i].encontrados) - parseInt(contSubRed[i].host))
		});
	}
	Gpastel('Desperdiciados',grafica,"Desperdicios de hosts por subred.");
}

function countHosts(){
	var totalHosts = 0;
	for (var i = 0; i < cont_HostTB.length; i++)
		totalHosts+= parseInt(cont_HostTB[i].cant);
	return totalHosts;
}

function subnetear(redPrincipal){
	for (var i = 0; i < cont_HostTB.length; i++) {
		var enc 	 = 0;
		var contador = 2;
		
		while(enc < (parseInt(cont_HostTB[i].cant)+2)){
			enc = Math.pow(2,contador);
			contador++;
		}
		var cird = 32 - contador+1;
		var res = redPrincipal.split(".",4);
		var rangos = '';
		var broad = '';
		var mask = '';
		if(parseInt(cont_HostTB[i].cant)<maxHosts[0].claseC){
			rangos = res[0]+'.'+res[1]+'.'+res[2]+'.'+(parseInt(res[3])+1)+'\t-\t'+
			res[0]+'.'+res[1]+'.'+res[2]+'.'+(parseInt(res[3])+enc-2);
			broad = res[0]+'.'+res[1]+'.'+res[2]+'.'+(parseInt(res[3])+enc-1);
			if(parseInt(res[3])+enc==256){
				res = res[0]+'.'+res[1]+'.'+(parseInt(res[2])+1)+'.0';
			}else
				res = res[0]+'.'+res[1]+'.'+res[2]+'.'+(parseInt(res[3])+enc);
			mask = '255.255.255.'+(256-parseInt(enc));

		}else if(parseInt(cont_HostTB[i].cant)<maxHosts[0].claseB){
			enc = Math.pow(2,contador-9);
			rangos = res[0]+'.'+res[1]+'.'+res[2]+'.1\t-\t'+
			res[0]+'.'+res[1]+'.'+(parseInt(res[2])+enc-1)+'.254';
			broad = res[0]+'.'+res[1]+'.'+(parseInt(res[2])+enc-1)+'.255';
			if(parseInt(res[2])+enc==256){
				res = res[0]+'.'+(parseInt(res[1])+1)+'.0.0';
			}else
				res = res[0]+'.'+res[1]+'.'+(parseInt(res[2])+enc)+'.0';
			mask = '255.255.'+(256-parseInt(enc))+'.0';
			enc = Math.pow(2,contador-1);

		}else if(parseInt(cont_HostTB[i].cant)<maxHosts[0].claseA){
			enc = Math.pow(2,contador-17);
			rangos = res[0]+'.'+res[1]+'.0.1\t-\t'+
			res[0]+'.'+(parseInt(res[1])+enc-1)+'.255.254';
			broad = res[0]+'.'+(parseInt(res[1])+enc-1)+'.255.255';
			if(parseInt(res[2])+enc==256){
				res = (parseInt(res[0])+1)+'.0.0.0';
			}else
				res = res[0]+'.'+(parseInt(res[1])+enc)+'.0.0';
			mask = '255.'+(256-parseInt(enc))+'.0.0';
			enc = Math.pow(2,contador-1);
			
		}

		contSubRed.push({
			'name':cont_HostTB[i].name,
			'subred':redPrincipal,
			'cird':'/'+cird,
			'mask':mask,
			'host':cont_HostTB[i].cant,
			'encontrados':enc,
			'rangos':rangos,
			'broadcast':broad
		});
		console.log(redPrincipal);
		redPrincipal = res;

	}
	printSubnetTable();
}

function ordenar(){
    var i,j,aux;
    for (i=0;i<cont_HostTB.length;i++){
        for(j=i+1;j<cont_HostTB.length;j++)
        {
            if(parseInt(cont_HostTB[i].cant)<parseInt(cont_HostTB[j].cant))
            {
                aux=cont_HostTB[i].cant;
                cont_HostTB[i].cant=cont_HostTB[j].cant;
                cont_HostTB[j].cant=aux;

                aux=cont_HostTB[i].name;
                cont_HostTB[i].name=cont_HostTB[j].name;
                cont_HostTB[j].name=aux;
            }
        }
    }
}