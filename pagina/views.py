from django.http import HttpResponse
from django.template import loader

def index(request):
	"""text = "asd"
	return HttpResponse(pageContent())"""
	template = loader.get_template('pagina/index.html')
	context = {
		'me': 'you',
	}
	return HttpResponse(template.render(context,request))
	"""
def pageContent():
	htmlContent = "<!DOCTYPE html>"
	htmlContent +=	'<html lang="en"><head><meta charset="UTF-8" /><title>Document</title></head>'
	htmlContent += "<body>ff</body></html>"
	return htmlContent"""