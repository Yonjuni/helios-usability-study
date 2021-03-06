from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from helios_usabilitystudy.models import Question, Subject, Timestamp
import json
import os


def home(request):
    with open(os.path.join(os.path.dirname(__file__), "../helios_main/static/helios_main/index.html"),
              'r') as index_html_file:
        return HttpResponse(index_html_file.read(), content_type='text/html')


@csrf_exempt
def assign(request):
    if 'id' not in request.POST:
        return HttpResponse('{"Error": "No ID supplied."}', content_type='application/json', status=400)

    question = Question.objects.all()[0]
    options_list = question.options.all()

    options_dict = {}

    for op in options_list:
        options_dict[op.option_code] = {
            'option': op.option,
            'option_description': op.option_description}

    print("Experiment assigned")

    return HttpResponse(json.dumps({
        'question_data': {
            'question_id': question.pk,
            'question': question.question,
            'answers': question.number_answers,
            'options': options_dict}
    }), content_type='application/json')


@csrf_exempt
def save_duration(request):
    try:
        subject = Subject.objects.filter(subject_id=request.POST['id']).all()[0]
    except IndexError:
        return HttpResponse('{"Error": "Unknown subject."}', content_type='application/json')
    timestamp = Timestamp(subject=subject, timestamp=request.POST['time'],
                          type=request.POST['type'])
    timestamp.save()
