# Generated by Django 5.0 on 2024-09-28 15:08

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app2', '0013_alter_availability_options_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='TimeSlot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.TimeField()),
                ('end_time', models.TimeField()),
                ('tickets_available', models.PositiveIntegerField(default=0)),
                ('availability', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='time_slots', to='app2.availability')),
            ],
            options={
                'unique_together': {('availability', 'start_time', 'end_time')},
            },
        ),
    ]
