# Generated by Django 5.0 on 2024-09-25 07:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app2', '0002_alter_museum_address_alter_museum_city_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='museum',
            name='closing_days',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
