# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-08-15 08:10
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('helios_usabilitystudy', '0010_merge_20180815_0802'),
    ]

    operations = [
        migrations.AlterField(
            model_name='option',
            name='option_return_code',
            field=models.CharField(max_length=20, unique=True, verbose_name='Return-Code'),
        ),
        migrations.AlterField(
            model_name='timestamp',
            name='timestamp_unix',
            field=models.CharField(max_length=14, verbose_name='Unix_Timestamp'),
        ),
    ]