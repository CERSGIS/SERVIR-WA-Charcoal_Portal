from django.urls import path, include
from .views import *

urlpatterns = [
	path("", root_view, name="rootView"),
	path("about/", about_view, name="aboutView"),

	# path("getdata/", getdata_view, name="aboutView"),

	# path("timeseries/", timeseries_view, name="aboutView"),

	# path("getchangedetection/", getchangeDetection, name="aboutView"),

	# path("getchangedetectionactive/", getchangeDetectionActive, name="aboutView"),

	# path("areacomputation/", areacomputationChangedetection, name="aboutView"),
	
	# path("loadLandsat/", loadLandsatComposite, name="aboutView"),

	# path("compute/", computeView, name="aboutView"),

	path("compute/", compute4View, name="aboutView"),

	path("heatmap/", heatmapjson, name="aboutView"),


	
	# path("datetimeseries/", datetimeseries_view, name="aboutView"),


	path("kilns/<slug:slug>/", kilnlayerView.as_view(),name='kilnjson'),

]


