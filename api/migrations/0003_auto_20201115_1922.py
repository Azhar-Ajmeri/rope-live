# Generated by Django 3.1.1 on 2020-11-15 13:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20201115_1235'),
    ]

    operations = [
        migrations.CreateModel(
            name='State',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.CharField(blank=True, default='', max_length=255, null=True)),
                ('project_Id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.project')),
            ],
        ),
        migrations.AddField(
            model_name='subworkpackage',
            name='state',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.state'),
        ),
    ]
