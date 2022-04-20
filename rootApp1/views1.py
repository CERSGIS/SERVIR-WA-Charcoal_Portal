from dateutil.relativedelta import relativedelta
from datetime import datetime, timedelta
from django.shortcuts import render, HttpResponse, redirect
from django.http import JsonResponse
from djgeojson.views import GeoJSONLayerView
from .models import *
from django.contrib.auth import authenticate
import ee
from datetime import datetime, date
from djgeojson.views import GeoJSONLayerView

from datetime import date

today1 = date.today()

# dd/mm/YY
today = today1.strftime("%Y-%m-%d")
# Create your views here.
# def login_view(request):
# 	request.session["next"] = request.GET.get("next")
# 	if request.method == "POST":
# 		username = request.POST.get("user", "")
# 		password = request.POST.get("pass", "")
# 		user = authenticate(username=username, password=password)
# 		if user:
# 			login(request, user)
# 			if request.session["next"]:
# 				return redirect(request.session["next"])
# 			else:
# 				return redirect("/backend/")
# 	return render(request, "rootApp/login_form.html", locals())


def root_view(request):
    toHTML = {}
    year = datetime.now().year

    return render(request, 'rootApp/index.html', locals())


def about_view(request):
    toHTML = {}
    return render(request, 'rootApp/about.html', toHTML)


def loaddef():
    try:

        ee.Initialize()
    except Exception as e:
        credentials = ee.ServiceAccountCredentials(
            'geeresearch@geeapp-1577771889447.iam.gserviceaccount.com', 'geeapp-1577771889447-dd8ab00048c7.json')
        ee.Initialize(credentials)



def computeView(request):

    toHTML = {}

    loaddef()

    try:
       
        img1 = ee.Image('users/mamponsah91/Charcoal_monitoring/20200428_NIR_img1')
        img2 = ee.Image('users/mamponsah91/Charcoal_monitoring/20200428_NIR_img2')
        img3 = ee.Image('users/mamponsah91/Charcoal_monitoring/20200428_NIR_img3')
        img4 = ee.Image('users/mamponsah91/Charcoal_monitoring/BLK4_NIR_I1_202012')

        vectorize = ee.Geometry.Rectangle(-1.66598754417709,9.272489755988794, -1.6229005385618556,9.24004465138768);

        #Area of Interest
        AOI=img4.geometry()
        #
        #
        # Define a neighborhood with a kernel.
        kernel = ee.Kernel.circle(radius=12)
        #
        #
        #Map kiln scar seeds

        band=['b1'];#NIR band
        afil=(img4.select(band)).focal_mean( kernel= kernel, iterations=2)

        #Intensity enhancement of NIR image
        IEA=((img4.select('b1')).subtract(afil.select(band))).divide(afil.select(band))

        #Kiln scar seeds
        #
        KS=(IEA.lte(-0.02))

        objectId = KS.connectedComponents(
            connectedness=ee.Kernel.plus(1), maxSize=128)

        # Compute the number of pixels in each object defined by the "labels" band.

        objectSize = objectId.select('labels').connectedPixelCount(
            maxSize=128, eightConnected=False)

        pixelArea = ee.Image.pixelArea()
        print(pixelArea,'pixelArea')
        objectArea = objectSize.multiply(pixelArea)

        #
        # Threshold the `objectArea` image to define a mask that will mask out
        # objects below a given size.
        areaMask = objectArea.lte(250).And(objectArea.gt(9))
        objectId = objectId.updateMask(areaMask)



        vec=objectId.select(0).clip(vectorize).reduceToVectors(
          geometry=AOI,
          geometryType='centroid',
          maxPixels=1e9
        )
        #
        #

        vec_visparam = {'color': 'FF0000'}

        idfeatures = vec.getMapId(vec_visparam)

        toHTML['mapid'] = str(idfeatures['tile_fetcher'].url_format)
        toHTML['token'] = idfeatures['token']

    except Exception as e:
        raise e
  

    return JsonResponse(toHTML, safe=False)




def maskS2clouds(image):
    qa = image.select('QA60')

    # Bits 10 and 11 are clouds and cirrus, respectively.
    cloudBitMask = 1 << 10
    cirrusBitMask = 1 << 11

    # Both flags should be set to zero, indicating clear conditions.
    mask = qa.bitwiseAnd(cloudBitMask).eq(0) \
    .And(qa.bitwiseAnd(cirrusBitMask).eq(0))

    return image.updateMask(mask).divide(10000)



# def func_pjr(image)return image.clip(block4)}: \
#     .map(function(image){return image.clip(block4)} \
#     .map(func_pjr) \
#     .median()


def computeArea(dataset, poly=None):
    loaddef()
    if poly:
        galamsey_aoi = poly
    else:
        galamsey_aoi = ee.FeatureCollection("users/mamponsah91/Gala_pilarea")
    dataset = ee.Image(dataset)
    area = dataset.multiply(ee.Image.pixelArea()).divide(1000*1000)

    stat = area.reduceRegion(
        **{
            'reducer': ee.Reducer.sum(),
            'geometry': galamsey_aoi,
            'crs': 'EPSG:4326',
            'scale': 10,
            'maxPixels': 1e13
        })

    # print (stat.getInfo())

    return stat.getInfo()




def compute4View(request):

    toHTML = {}

    loaddef()

    start = request.GET.get("from")
    end = request.GET.get("to")

    datefrom = datetime.strptime(start, "%Y-%m-%d")
    dateto = datetime.strptime(end, "%Y-%m-%d")

    try:


        print(datefrom)

        vectorize=ee.FeatureCollection('users/mamponsah91/Charcoal_monitoring/sub_blks_b4AOI')

        S2 = ee.ImageCollection('COPERNICUS/S2') \
                          .filterDate(datefrom, dateto) \
                          .filterBounds(vectorize) \
                          .filterMetadata('MGRS_TILE','equals','30PXR') \
                          .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))\
                          .median()
                          # .map(maskS2clouds)

        
        #Area of Interest
        AOI = S2.geometry()

        # Define a neighborhood with a kernel.
        kernel = ee.Kernel.circle(radius=12)

        #Map kiln scar seeds
        band=['B8'];#NIR band

         
        afil=(S2.select(band)).focal_mean(kernel= kernel, iterations= 2);
        #Intensity enhancement of NIR image
        IEA=((S2.select('B8')).subtract(afil.select(band))).divide(afil.select(band))

        #Kiln scar seeds
        #
        KS=(IEA.lte(-0.10))
     

        # Uniquely label the hotspot image objects.
       
        objectId = KS.connectedComponents(
            connectedness=ee.Kernel.plus(1), maxSize=128)

        # Compute the number of pixels in each object defined by the "labels" band.
        objectSize = objectId.select('labels').connectedPixelCount(
            maxSize=128, eightConnected=False)

        pixelArea = ee.Image.pixelArea()
        objectArea = objectSize.multiply(pixelArea)

        areaMask = objectArea.lte(250).And(objectArea.gt(100))
        objectId = objectId.updateMask(areaMask)



        vec=objectId.select(0).clip(vectorize).reduceToVectors(
          geometry=vectorize,
          geometryType='centroid',
          maxPixels=1e9,
          crs = "EPSG:32630",
          scale =10,
          # crsTransform='EPSG:32630',

        )



        points = vec.map(func_knn)


        heatmapImg = heatmap(points,points,20)


        gradient = ['lightgreen','yellow','red']
        

        vec_visparam = {'palette':gradient, 'min':0, 'max':0.02}

        idfeatures = heatmapImg.getMapId(vec_visparam)

        toHTML['mapid'] = str(idfeatures['tile_fetcher'].url_format)
        toHTML['token'] = idfeatures['token']


        # vec_visparam = {'color': 'FF0000'}

        # idfeatures = vec.getMapId(vec_visparam)

        # toHTML['mapid'] = str(idfeatures['tile_fetcher'].url_format)
        # toHTML['token'] = idfeatures['token']


    except Exception as e:
        raise e


    return JsonResponse(toHTML, safe=False)





def func_knn(feature):
  return feature.set('dummy',1)



def heatmap(point,vec,radius):
  ptImg = point.reduceToImage(['dummy'],ee.Reducer.first()).unmask(0)
  kernel = ee.Kernel.circle(radius)
  result = ptImg.convolve(kernel)
  return result.updateMask(result.neq(0))


def heatmapjson(request):
    arr=[]
    for aa in Kilns.objects.all():

      
        arr.append([aa.geom.centroid.x,aa.geom.centroid.y])

    return JsonResponse(arr ,safe=False)




class kilnlayerView(GeoJSONLayerView):
  model = Kilns
  precision = 4
  simplify = 0.001
  properties = ('year',)

  def get_queryset(self):
    qs = super(kilnlayerView, self).get_queryset()
    vallen = len(self.kwargs.get('slug'))

    print(self.kwargs.get('slug'))
    print(self.kwargs.get('slug'))
    if self.kwargs.get('slug') != 'None':
      qs = qs.filter(year = self.kwargs.get('slug'))
    return qs















