# Generated by Django 3.1.1 on 2021-03-29 12:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_auto_20210329_1730'),
    ]

    operations = [
        migrations.AddField(
            model_name='workpackage3',
            name='status',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='api.status'),
        ),
    ]
