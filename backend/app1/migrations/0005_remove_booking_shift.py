# Generated by Django 5.0 on 2024-10-18 09:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0004_booking_shift'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='booking',
            name='shift',
        ),
    ]
