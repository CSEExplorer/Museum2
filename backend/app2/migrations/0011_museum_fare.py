# Generated by Django 5.0 on 2024-09-28 08:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app2', '0010_museum_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='museum',
            name='fare',
            field=models.IntegerField(default=0, max_length=30),
        ),
    ]