# Generated by Django 3.1.1 on 2020-11-14 10:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Phase',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.CharField(blank=True, default='', max_length=255)),
                ('completed', models.BooleanField(blank=True, default=False)),
                ('date_of_creation', models.DateField(auto_now_add=True)),
                ('date_of_start', models.DateField(blank=True, null=True)),
                ('date_of_end', models.DateField(blank=True, null=True)),
                ('responsible', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.CharField(blank=True, default='', max_length=255)),
                ('completed', models.BooleanField(blank=True, default=False)),
                ('date_of_creation', models.DateField(auto_now_add=True)),
                ('date_of_start', models.DateField(blank=True, null=True)),
                ('date_of_end', models.DateField(blank=True, null=True)),
                ('responsible', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='TimeLine',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.CharField(blank=True, default='', max_length=255)),
                ('completed', models.BooleanField(blank=True, default=False)),
                ('date_of_creation', models.DateField(auto_now_add=True)),
                ('date_of_start', models.DateField(blank=True, null=True)),
                ('date_of_end', models.DateField(blank=True, null=True)),
                ('responsible', models.CharField(blank=True, max_length=255, null=True)),
                ('phase_Id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.phase')),
                ('project_Id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.project')),
            ],
        ),
        migrations.CreateModel(
            name='WorkPackages',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.CharField(blank=True, default='', max_length=255)),
                ('completed', models.BooleanField(blank=True, default=False)),
                ('date_of_creation', models.DateField(auto_now_add=True)),
                ('date_of_start', models.DateField(blank=True, null=True)),
                ('date_of_end', models.DateField(blank=True, null=True)),
                ('responsible', models.CharField(blank=True, max_length=255, null=True)),
                ('project_Id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.project')),
                ('time_line', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.timeline')),
            ],
        ),
        migrations.CreateModel(
            name='SubWorkPackages',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.CharField(blank=True, default='', max_length=255)),
                ('completed', models.BooleanField(blank=True, default=False)),
                ('date_of_creation', models.DateField(auto_now_add=True)),
                ('date_of_start', models.DateField(blank=True, null=True)),
                ('date_of_end', models.DateField(blank=True, null=True)),
                ('responsible', models.CharField(blank=True, max_length=255, null=True)),
                ('project_Id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.project')),
                ('time_line', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.timeline')),
                ('workPackage', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.workpackages')),
            ],
        ),
        migrations.AddField(
            model_name='phase',
            name='project_Id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.project'),
        ),
    ]
