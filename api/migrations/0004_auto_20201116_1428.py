# Generated by Django 2.0.2 on 2020-11-16 08:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20201115_1922'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='completed',
            field=models.BooleanField(default=False),
        ),
    ]
