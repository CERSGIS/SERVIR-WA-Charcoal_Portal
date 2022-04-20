from django.urls import path, include
from .views import *

urlpatterns = [
	path("", root_view, name="rootView"),
	path("about/", about_view, name="aboutView"),

	path("getdata/", getdata_view, name="aboutView"),

	path("timeseries/", timeseries_view, name="aboutView"),

	path("getchangedetection/", getchangeDetection, name="aboutView"),

	path("getchangedetectionactive/", getchangeDetectionActive, name="aboutView"),

	path("areacomputation/", areacomputationChangedetection, name="aboutView"),
	
	path("loadLandsat/", loadLandsatComposite, name="aboutView"),

	path("loadaoi/", loadAoi, name="aboutView"),

	path("getdownload/", getImagedownload, name="getdownload"),
	
	path("datetimeseries/", datetimeseries_view, name="aboutView"),

	path("region/", RegionView.as_view(),name='region'),

	path("district/", DistrictView.as_view(),name='region'),

	path("kilns/<slug:slug>/", kilnlayerView.as_view(),name='kilnjson'),

	path("blocks/<slug:slug>/", blockslayerView.as_view(),name='blocks'),

	path("heatmap/<slug:year>/", heatMap ,name='heatmap'),

	path("countkiln/", countKiln, name="countkiln"),

	path("protectareajson/", ProtectedAreaView.as_view(),name='protectarea'),

	path("treecover/<slug:year>", fetchTreecoverview,name='treecover')




]


