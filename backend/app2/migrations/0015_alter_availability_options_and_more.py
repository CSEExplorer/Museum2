# Generated by Django 5.0 on 2024-09-28 15:37

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app2', '0014_timeslot'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='availability',
            options={'ordering': ['museum', 'date'], 'verbose_name': 'Availability', 'verbose_name_plural': 'Availabilities'},
        ),
        migrations.AlterUniqueTogether(
            name='availability',
            unique_together={('museum', 'date')},
        ),
        migrations.AlterField(
            model_name='availability',
            name='day',
            field=models.CharField(blank=True, editable=False, max_length=9),
        ),
        migrations.CreateModel(
            name='Shift',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('shift_type', models.CharField(choices=[('Morning', 'Morning Shift'), ('Evening', 'Evening Shift')], max_length=10)),
                ('tickets_available', models.PositiveIntegerField(default=0)),
                ('availability', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shifts', to='app2.availability')),
            ],
            options={
                'verbose_name': 'Shift',
                'verbose_name_plural': 'Shifts',
                'unique_together': {('availability', 'shift_type')},
            },
        ),
        migrations.DeleteModel(
            name='TimeSlot',
        ),
        migrations.RemoveField(
            model_name='availability',
            name='tickets_available',
        ),
    ]