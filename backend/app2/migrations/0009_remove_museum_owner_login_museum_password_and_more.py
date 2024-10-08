# Generated by Django 5.0 on 2024-09-25 17:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app2', '0008_remove_museumownerlogin_user_token'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='museum',
            name='owner_login',
        ),
        migrations.AddField(
            model_name='museum',
            name='password',
            field=models.CharField(default=1234, max_length=128),
        ),
        migrations.AlterField(
            model_name='museum',
            name='unique_id',
            field=models.CharField(editable=False, max_length=8, unique=True),
        ),
        migrations.DeleteModel(
            name='Token',
        ),
        migrations.DeleteModel(
            name='MuseumOwnerLogin',
        ),
    ]
