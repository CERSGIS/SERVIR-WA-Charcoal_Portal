from django.db import models
from django.contrib.gis.db import models
from django.contrib.gis.db.models import GeometryField
from django.contrib.gis.geos import GEOSGeometry

class District(models.Model):
    geom = models.GeometryField(blank=True, null=True)
    region = models.CharField(max_length=50, blank=True, null=True)
    district = models.CharField(max_length=50, blank=True, null=True)
    district_code = models.CharField(max_length=254, blank=True, null=True)
    reg_code = models.CharField(max_length=250, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'district'


class Region(models.Model):
    # id = models.AutoField()
    geom = models.GeometryField(blank=True, null=True)
    region = models.CharField(max_length=50, blank=True, null=True)
    reg_code = models.CharField(primary_key=True, max_length=250)

    class Meta:
        managed = False
        db_table = 'region'


class ProtectedArea(models.Model):
    
    geom = models.GeometryField(blank=True, null=True)
    reserve_na = models.CharField(max_length=30, blank=True, null=True)
    region = models.CharField(max_length=30, blank=True, null=True)
    area_sqkm = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Protected Area'


class Kilns(models.Model):
    geom = models.GeometryField(blank=True, null=True)
    block = models.CharField(max_length=8, blank=True, null=True)
    year = models.CharField(max_length=5, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Kilns'

class Blocks(models.Model):
    geom = models.GeometryField(blank=True, null=True)
    blocks = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Blocks'


class test(models.Model):
    # id = models.AutoField()
    geom = models.GeometryField(blank=True, null=True)