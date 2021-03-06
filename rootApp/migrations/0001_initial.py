# Generated by Django 3.1 on 2021-06-06 00:10

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Blocks',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('geom', django.contrib.gis.db.models.fields.GeometryField(blank=True, null=True, srid=4326)),
                ('blocks', models.CharField(blank=True, max_length=10, null=True)),
            ],
            options={
                'db_table': 'Blocks',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='District',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('geom', django.contrib.gis.db.models.fields.GeometryField(blank=True, null=True, srid=4326)),
                ('region', models.CharField(blank=True, max_length=50, null=True)),
                ('district', models.CharField(blank=True, max_length=50, null=True)),
                ('district_code', models.CharField(blank=True, max_length=254, null=True)),
                ('reg_code', models.CharField(blank=True, max_length=250, null=True)),
            ],
            options={
                'db_table': 'district',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Kilns',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('geom', django.contrib.gis.db.models.fields.GeometryField(blank=True, null=True, srid=4326)),
                ('block', models.CharField(blank=True, max_length=8, null=True)),
                ('year', models.CharField(blank=True, max_length=5, null=True)),
            ],
            options={
                'db_table': 'Kilns',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ProtectedArea',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('geom', django.contrib.gis.db.models.fields.GeometryField(blank=True, null=True, srid=4326)),
                ('reserve_na', models.CharField(blank=True, max_length=30, null=True)),
                ('region', models.CharField(blank=True, max_length=30, null=True)),
                ('area_sqkm', models.FloatField(blank=True, null=True)),
            ],
            options={
                'db_table': 'Protected Area',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Region',
            fields=[
                ('geom', django.contrib.gis.db.models.fields.GeometryField(blank=True, null=True, srid=4326)),
                ('region', models.CharField(blank=True, max_length=50, null=True)),
                ('reg_code', models.CharField(max_length=250, primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'region',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='test',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('geom', django.contrib.gis.db.models.fields.GeometryField(blank=True, null=True, srid=4326)),
            ],
        ),
    ]
