# Generated by Django 2.0.2 on 2018-02-27 19:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('helios_usabilitystudy', '0006_option_option_return_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='timestamp',
            name='type',
            field=models.CharField(max_length=80, verbose_name='Type'),
        ),
    ]