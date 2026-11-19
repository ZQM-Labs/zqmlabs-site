'use strict';
/* Embedded REAL public data (EPSG:32617 converted to WGS84 lon/lat).
   Six Volusia County parcels near Turnbull Bay, New Smyrna Beach, FL
   (union lon -80.99701..-80.97678, lat 29.01318..29.03829).
   Wetland = USFWS NWI indicator polygons (7); flood = FEMA NFHL Zone A
   (Special Flood Hazard Area) polygons (3). Areas/overlaps computed from
   the GeoPackage; sources accessed 2026-11-16. */
var PARCELS = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"layer":"parcel","parcel_id":"730901000W14","area_m2":41746.99,"area_acres":10.315905084805436,"wetland_overlap_m2":23633.15,"wetland_overlap_pct":56.61,"wetland_coverage_pct":100.0,"flood_overlap_m2":0.0,"flood_overlap_pct":0.0,"flood_coverage_pct":100.0,"flood_zones":["X"],"flood_unknown_m2":0},"geometry":{"type":"MultiPolygon","coordinates":[[[[-80.9936531,29.0366428],[-80.9938065,29.036713],[-80.9939624,29.0367773],[-80.9941206,29.0368356],[-80.9942809,29.0368879],[-80.9944431,29.0369341],[-80.9946069,29.0369741],[-80.9957011,29.0372206],[-80.9958231,29.0372503],[-80.9959437,29.0372856],[-80.9960624,29.0373264],[-80.9961791,29.0373728],[-80.9962936,29.0374245],[-80.9964055,29.0374815],[-80.9965146,29.0375437],[-80.9966207,29.0376108],[-80.9967236,29.0376829],[-80.996823,29.0377596],[-80.9968148,29.0377513],[-80.9968082,29.0377418],[-80.9968033,29.0377312],[-80.9968003,29.03772],[-80.9967992,29.0377084],[-80.9968001,29.0376969],[-80.996803,29.0376856],[-80.9968077,29.037675],[-80.9968142,29.0376653],[-80.9968222,29.0376569],[-80.9968316,29.03765],[-80.9968419,29.0376448],[-80.9968531,29.0376414],[-80.9968646,29.03764],[-80.9968762,29.0376405],[-80.9970025,29.0376404],[-80.9970057,29.0376327],[-80.9969785,29.0375882],[-80.9969031,29.0374595],[-80.9968312,29.0373293],[-80.9967628,29.0371976],[-80.9967025,29.0370739],[-80.9966986,29.0370658],[-80.9966676,29.037003],[-80.996635,29.036941],[-80.9966005,29.0368795],[-80.9965645,29.0368189],[-80.9965267,29.036759],[-80.9964874,29.0367001],[-80.9964463,29.0366418],[-80.9964038,29.0365846],[-80.9963595,29.0365282],[-80.9963139,29.0364729],[-80.9962179,29.0363651],[-80.9961162,29.0362615],[-80.9960088,29.0361624],[-80.9958961,29.036068],[-80.9961169,29.0358542],[-80.9960057,29.0357692],[-80.9958912,29.0356887],[-80.9956914,29.0359179],[-80.9955655,29.0358374],[-80.9954354,29.0357622],[-80.9953437,29.0357139],[-80.9953012,29.0356918],[-80.995223,29.0356481],[-80.9951467,29.0356013],[-80.9950731,29.0355519],[-80.9950016,29.0354996],[-80.994933,29.0354449],[-80.9948668,29.0353874],[-80.9948037,29.0353278],[-80.9947432,29.0352656],[-80.9946861,29.0352016],[-80.9946319,29.0351351],[-80.9945796,29.0350649],[-80.9945306,29.0349923],[-80.9944852,29.0350806],[-80.9936768,29.0365984],[-80.9936531,29.0366428]]]]}},{"type":"Feature","properties":{"layer":"parcel","parcel_id":"731500000044","area_m2":24077.72,"area_acres":5.949734604556933,"wetland_overlap_m2":0.0,"wetland_overlap_pct":0.0,"wetland_coverage_pct":100.0,"flood_overlap_m2":12355.93,"flood_overlap_pct":51.32,"flood_coverage_pct":100.0,"flood_zones":["A","X"],"flood_unknown_m2":0},"geometry":{"type":"MultiPolygon","coordinates":[[[[-80.976804,29.0309462],[-80.9768053,29.0310645],[-80.9768053,29.0310677],[-80.9771068,29.0310661],[-80.9775077,29.0310641],[-80.9775109,29.0310596],[-80.9784348,29.0297328],[-80.9767818,29.0289194],[-80.9767844,29.0291587],[-80.9767859,29.0292962],[-80.9767874,29.0294337],[-80.9767889,29.0295712],[-80.9767904,29.0297087],[-80.9767919,29.0298462],[-80.9767935,29.0299837],[-80.976795,29.0301212],[-80.9767965,29.0302587],[-80.976798,29.0303962],[-80.9767995,29.0305337],[-80.976801,29.0306712],[-80.9768025,29.0308087],[-80.976804,29.0309462]]]]}},{"type":"Feature","properties":{"layer":"parcel","parcel_id":"731503000001","area_m2":54785.07,"area_acres":13.53768647280138,"wetland_overlap_m2":24226.99,"wetland_overlap_pct":44.22,"wetland_coverage_pct":100.0,"flood_overlap_m2":0.0,"flood_overlap_pct":0.0,"flood_coverage_pct":81.84,"flood_zones":["X"],"flood_unknown_m2":9948.5},"geometry":{"type":"MultiPolygon","coordinates":[[[[-80.9808898,29.0381924],[-80.9809514,29.0382946],[-80.9809576,29.0382919],[-80.9809839,29.0382792],[-80.9811659,29.0381979],[-80.9811818,29.0381908],[-80.9821504,29.0377282],[-80.9822086,29.0377011],[-80.98254,29.037544],[-80.9827389,29.0374509],[-80.9827711,29.0374358],[-80.9828924,29.0373791],[-80.9844159,29.0366615],[-80.9853727,29.0362102],[-80.9854948,29.0361526],[-80.9855492,29.036127],[-80.9855286,29.0354722],[-80.9856074,29.035471],[-80.9856055,29.0352699],[-80.9856118,29.035158],[-80.9856247,29.0350809],[-80.9856443,29.0350049],[-80.9856706,29.0349306],[-80.9857035,29.0348582],[-80.9859615,29.0349257],[-80.9860565,29.0349676],[-80.9860932,29.0349099],[-80.9861347,29.034858],[-80.9861792,29.0348122],[-80.9862286,29.03477],[-80.9862848,29.0347306],[-80.9863425,29.0346975],[-80.9864062,29.0346681],[-80.9864729,29.0346444],[-80.9865388,29.0346271],[-80.986545,29.0346262],[-80.9864721,29.034627],[-80.9860004,29.0346326],[-80.9857055,29.0346247],[-80.9857132,29.0346016],[-80.9861888,29.0338535],[-80.9859156,29.0337194],[-80.9857108,29.0336187],[-80.9858977,29.0333247],[-80.9859138,29.0332995],[-80.9850776,29.0329219],[-80.9847616,29.0334189],[-80.9842064,29.0331477],[-80.9836265,29.0328644],[-80.9830945,29.0326046],[-80.9826039,29.0323649],[-80.9825163,29.0323605],[-80.9824899,29.0326876],[-80.9823844,29.0334429],[-80.9823122,29.0339527],[-80.9823431,29.0339865],[-80.9823536,29.0339042],[-80.9823839,29.0336971],[-80.9824142,29.0334926],[-80.9824536,29.0332267],[-80.9826717,29.0329589],[-80.9830074,29.0328124],[-80.983285,29.0328191],[-80.9833757,29.0328414],[-80.983279,29.033146],[-80.9833639,29.0331767],[-80.9833647,29.033177],[-80.9835402,29.032901],[-80.9837453,29.0330011],[-80.9839505,29.0331013],[-80.9841556,29.0332015],[-80.9843607,29.0333018],[-80.9845767,29.0334072],[-80.9847235,29.0334789],[-80.9847819,29.0335074],[-80.9848958,29.0335631],[-80.9850056,29.0336228],[-80.9851211,29.0337002],[-80.9852267,29.0337879],[-80.9853214,29.0338847],[-80.9854041,29.0339896],[-80.9854635,29.0340831],[-80.9855247,29.03419],[-80.9856301,29.0343743],[-80.9853086,29.0345164],[-80.9853214,29.0345477],[-80.9853252,29.0345808],[-80.9853149,29.0346273],[-80.9852872,29.034668],[-80.9852631,29.0346878],[-80.9852348,29.0347028],[-80.9852035,29.0347122],[-80.9851707,29.0347156],[-80.9851378,29.0347129],[-80.9851063,29.0347042],[-80.9850776,29.0346899],[-80.9850529,29.0346706],[-80.9850224,29.0346268],[-80.9850123,29.0345762],[-80.985024,29.0345259],[-80.9850559,29.0344829],[-80.9850251,29.0344569],[-80.9847629,29.0345728],[-80.9847397,29.0346742],[-80.9847061,29.0348217],[-80.9846273,29.034911],[-80.9846129,29.0349273],[-80.9845486,29.0350001],[-80.9843798,29.035067],[-80.9843313,29.0350862],[-80.9842044,29.0350866],[-80.9840597,29.0350872],[-80.9840605,29.0352653],[-80.9840609,29.0353418],[-80.9840615,29.0354795],[-80.9840624,29.0356859],[-80.984316,29.0356967],[-80.9843927,29.0357468],[-80.9845558,29.0358534],[-80.9846109,29.0359554],[-80.9846661,29.0360574],[-80.9846547,29.0362831],[-80.9845895,29.0363804],[-80.9845243,29.0364777],[-80.9844078,29.0365406],[-80.9843053,29.0365959],[-80.984177,29.036603],[-80.9841077,29.0366069],[-80.9838748,29.0365644],[-80.9838472,29.0366812],[-80.9838286,29.036706],[-80.9836114,29.0369959],[-80.9833386,29.037123],[-80.9831312,29.0372196],[-80.9829239,29.0373162],[-80.9827165,29.0374127],[-80.9825702,29.0371702],[-80.9824426,29.0373311],[-80.9822854,29.0375047],[-80.9821148,29.0377006],[-80.9819005,29.0374849],[-80.9818758,29.0374952],[-80.9818881,29.0375287],[-80.9818902,29.0375639],[-80.9818822,29.0375984],[-80.9818644,29.03763],[-80.9818381,29.0376566],[-80.9818049,29.0376764],[-80.9817671,29.0376882],[-80.9817272,29.0376911],[-80.9816877,29.037685],[-80.9816512,29.0376703],[-80.9816202,29.037648],[-80.9815967,29.0376194],[-80.9815822,29.0375866],[-80.9815777,29.0375516],[-80.9815835,29.0375167],[-80.9815992,29.0374842],[-80.9815077,29.0374372],[-80.9813316,29.037262],[-80.9815105,29.0371106],[-80.9816641,29.0369569],[-80.9818033,29.0367928],[-80.9819271,29.0366193],[-80.9820344,29.0364377],[-80.9821249,29.036249],[-80.9821976,29.0360547],[-80.9822524,29.0358558],[-80.9822888,29.0356537],[-80.9823066,29.0354497],[-80.9823084,29.035348],[-80.982308,29.0352443],[-80.982307,29.035038],[-80.9823061,29.0348318],[-80.9823055,29.0347031],[-80.9823052,29.034644],[-80.9823052,29.0346248],[-80.9823058,29.0345423],[-80.982274,29.03457],[-80.9822771,29.0353481],[-80.9822713,29.0355188],[-80.9822523,29.0356887],[-80.9822202,29.0358571],[-80.9821752,29.0360232],[-80.9821174,29.0361863],[-80.9820472,29.0363455],[-80.9819648,29.0365001],[-80.9818706,29.0366495],[-80.9817652,29.036793],[-80.9816489,29.0369297],[-80.9815223,29.0370593],[-80.9813859,29.037181],[-80.9812405,29.0372942],[-80.9810867,29.0373986],[-80.9809251,29.0374935],[-80.9807566,29.0375785],[-80.9806228,29.0376409],[-80.9805716,29.0376647],[-80.9808898,29.0381924]]],[[[-80.9828464,29.0367292],[-80.982765,29.0368766],[-80.9831997,29.0366741],[-80.9832471,29.0366449],[-80.9832156,29.0366143],[-80.9829432,29.0365242],[-80.9828464,29.0367292]]]]}},{"type":"Feature","properties":{"layer":"parcel","parcel_id":"731510000006","area_m2":34782.69,"area_acres":8.594990079558645,"wetland_overlap_m2":29157.46,"wetland_overlap_pct":83.83,"wetland_coverage_pct":100.0,"flood_overlap_m2":34493.2,"flood_overlap_pct":99.17,"flood_coverage_pct":100.0,"flood_zones":["A","X"],"flood_unknown_m2":0},"geometry":{"type":"MultiPolygon","coordinates":[[[[-80.993555,29.0247265],[-80.9933886,29.0245972],[-80.9933635,29.0238258],[-80.9932821,29.0237102],[-80.9919277,29.0237135],[-80.9918605,29.0237648],[-80.9918414,29.0238976],[-80.9918428,29.0240087],[-80.9918392,29.0240108],[-80.991697,29.0240954],[-80.9916375,29.0241249],[-80.9916161,29.0242278],[-80.9916392,29.0244197],[-80.9917041,29.02455],[-80.991769,29.0246803],[-80.99181,29.0247357],[-80.9918509,29.024791],[-80.9918525,29.0247935],[-80.9918547,29.0249631],[-80.9918556,29.0250271],[-80.9918393,29.0250415],[-80.9918135,29.0250642],[-80.9917781,29.0251345],[-80.9917428,29.0252048],[-80.9917368,29.0253218],[-80.9917308,29.0254388],[-80.9916798,29.0255228],[-80.9916287,29.0256068],[-80.991747,29.0255875],[-80.9918638,29.0255685],[-80.9918997,29.0255639],[-80.9919324,29.0255807],[-80.9922283,29.0255955],[-80.99222,29.0256758],[-80.9922133,29.0257424],[-80.9923265,29.0257337],[-80.9924397,29.025725],[-80.9925229,29.0257427],[-80.9926061,29.0257604],[-80.9927417,29.0257572],[-80.9928773,29.025754],[-80.9928895,29.0256776],[-80.9929025,29.0255958],[-80.9929764,29.0255947],[-80.9932842,29.0255725],[-80.9933672,29.0255725],[-80.9933852,29.0255239],[-80.9934011,29.0254746],[-80.993419,29.0254085],[-80.9934331,29.0253414],[-80.9934435,29.025274],[-80.99345,29.0252061],[-80.9934528,29.0251131],[-80.9934558,29.0250561],[-80.9934658,29.0250014],[-80.9934819,29.0249482],[-80.9935039,29.0248971],[-80.9935314,29.0248488],[-80.9935642,29.0248039],[-80.9936019,29.0247629],[-80.993555,29.0247265]]]]}},{"type":"Feature","properties":{"layer":"parcel","parcel_id":"732101000080","area_m2":58555.96,"area_acres":14.469493910257208,"wetland_overlap_m2":0.0,"wetland_overlap_pct":0.0,"wetland_coverage_pct":100.0,"flood_overlap_m2":0.0,"flood_overlap_pct":0.0,"flood_coverage_pct":100.0,"flood_zones":["X"],"flood_unknown_m2":0},"geometry":{"type":"MultiPolygon","coordinates":[[[[-80.9901327,29.0131842],[-80.9898862,29.013233],[-80.9896084,29.0139179],[-80.9905984,29.0159556],[-80.9908195,29.0162935],[-80.9925961,29.0162539],[-80.9925928,29.0160943],[-80.9925138,29.0160955],[-80.9924873,29.0151773],[-80.9923069,29.0151809],[-80.9922872,29.0144966],[-80.9923031,29.0144962],[-80.9922845,29.0138609],[-80.9928588,29.0138458],[-80.9928568,29.0137771],[-80.9922362,29.0137933],[-80.9922345,29.0137326],[-80.9916807,29.0137446],[-80.9916826,29.0138078],[-80.9908323,29.0138263],[-80.9908163,29.0138154],[-80.990389,29.0139002],[-80.9903767,29.0138523],[-80.9903758,29.0138499],[-80.9903745,29.0138478],[-80.9903728,29.0138458],[-80.9903708,29.0138442],[-80.9903685,29.013843],[-80.9903661,29.0138421],[-80.9903636,29.0138417],[-80.9903434,29.0138383],[-80.9903241,29.0138315],[-80.9903062,29.0138216],[-80.9902902,29.0138087],[-80.9902767,29.0137934],[-80.990266,29.0137759],[-80.9902584,29.0137569],[-80.9902487,29.0137194],[-80.9902465,29.013707],[-80.9902462,29.0136945],[-80.9902478,29.0136821],[-80.9902502,29.0136627],[-80.9902495,29.0136433],[-80.9902457,29.0136241],[-80.9901327,29.0131842]],[[-80.9915794,29.0145138],[-80.9915638,29.0139765],[-80.9914637,29.0139788],[-80.991461,29.0138824],[-80.9921578,29.0138642],[-80.9921765,29.0144997],[-80.9915794,29.0145138]]]]}},{"type":"Feature","properties":{"layer":"parcel","parcel_id":"732200000042","area_m2":14336.37,"area_acres":3.5425948258585813,"wetland_overlap_m2":13352.28,"wetland_overlap_pct":93.14,"wetland_coverage_pct":100.0,"flood_overlap_m2":6659.32,"flood_overlap_pct":46.45,"flood_coverage_pct":100.0,"flood_zones":["A","X"],"flood_unknown_m2":0},"geometry":{"type":"MultiPolygon","coordinates":[[[[-80.9911726,29.0167843],[-80.9912624,29.0169207],[-80.9924831,29.0187751],[-80.9925162,29.0188254],[-80.9924721,29.017082],[-80.9924634,29.0167682],[-80.9911726,29.0167843]]]]}},{"type":"Feature","properties":{"layer":"wetland","feature_id":"WI-001","name":"Wetland indicator WI-001 — Freshwater Forested/Shrub Wetland (PFO1/3Cd), parcel 730901000W14","parcel_id":"730901000W14","area_m2":23633.15},"geometry":{"type":"Polygon","coordinates":[[[-80.9957011,29.0372206],[-80.9949566,29.0370529],[-80.9950182,29.0369946],[-80.9950067,29.0368984],[-80.9949779,29.0368276],[-80.9949203,29.0367567],[-80.9948397,29.0366909],[-80.994713,29.0366909],[-80.9945805,29.0367112],[-80.9945687,29.0367175],[-80.9945562,29.0367109],[-80.9942954,29.036749],[-80.9940926,29.0366727],[-80.9938607,29.0365453],[-80.993702,29.0365511],[-80.9944168,29.035209],[-80.9944309,29.0352182],[-80.994523,29.0352638],[-80.9945633,29.0353346],[-80.9945749,29.0354156],[-80.9946036,29.035532],[-80.9947188,29.0356484],[-80.9947649,29.0356535],[-80.9948916,29.035699],[-80.9949203,29.0357851],[-80.9949203,29.0358812],[-80.9949376,29.0360077],[-80.9950355,29.0360837],[-80.9951104,29.0360837],[-80.9952371,29.0361292],[-80.9952716,29.0362001],[-80.9953004,29.036276],[-80.9953637,29.0363013],[-80.9954444,29.0363013],[-80.9956171,29.0362861],[-80.995692,29.0362102],[-80.9957323,29.036109],[-80.9957496,29.0360078],[-80.9958705,29.0358863],[-80.9959339,29.0357547],[-80.995948,29.0357287],[-80.9960057,29.0357692],[-80.9961169,29.0358542],[-80.9958961,29.036068],[-80.9960088,29.0361624],[-80.9961162,29.0362615],[-80.996125,29.0362705],[-80.9961208,29.0363162],[-80.9961208,29.03652],[-80.9961203,29.0365207],[-80.9961239,29.036524],[-80.9961411,29.0366049],[-80.9961469,29.0366758],[-80.9961239,29.0367568],[-80.9960375,29.0368074],[-80.9958935,29.0368023],[-80.9958244,29.0367163],[-80.9958234,29.036715],[-80.9957726,29.0366505],[-80.995715,29.0366201],[-80.9956459,29.0366404],[-80.9955595,29.0367061],[-80.9955307,29.0367618],[-80.995548,29.0368478],[-80.9956122,29.0368912],[-80.9956228,29.0368985],[-80.9957035,29.0369339],[-80.9957841,29.0369693],[-80.9958474,29.0370199],[-80.9958705,29.0370655],[-80.9958762,29.0371414],[-80.9958024,29.0372452],[-80.9957011,29.0372206]]]}},{"type":"Feature","properties":{"layer":"wetland","feature_id":"WI-002","name":"Wetland indicator WI-002 — Freshwater Forested/Shrub Wetland (PSS1Ad), parcel 731503000001","parcel_id":"731503000001","area_m2":16154.09},"geometry":{"type":"Polygon","coordinates":[[[-80.9847781,29.0364906],[-80.984725,29.0364719],[-80.984704,29.0360541],[-80.984648,29.0360239],[-80.9846109,29.0359554],[-80.9845558,29.0358534],[-80.9845371,29.0358412],[-80.9845332,29.0358336],[-80.9844637,29.0357481],[-80.9843639,29.035728],[-80.984316,29.0356967],[-80.984204,29.035692],[-80.9840953,29.0356442],[-80.9840953,29.0355648],[-80.9840954,29.0352654],[-80.9841042,29.0351722],[-80.9841093,29.0351188],[-80.9842344,29.0350883],[-80.984239,29.0350865],[-80.9843313,29.0350862],[-80.9843798,29.035067],[-80.9845486,29.0350001],[-80.9846028,29.0349386],[-80.9846237,29.0349295],[-80.9847975,29.0348745],[-80.9848948,29.0349051],[-80.9851034,29.0349478],[-80.9853119,29.0349723],[-80.9854509,29.0350151],[-80.9855066,29.0350762],[-80.9854711,29.0351956],[-80.9854835,29.0354083],[-80.9854972,29.0356441],[-80.9855102,29.0358511],[-80.9855233,29.0359086],[-80.9854971,29.0360696],[-80.9849083,29.0363455],[-80.9848207,29.0364705],[-80.9847781,29.0364906]]]}},{"type":"Feature","properties":{"layer":"wetland","feature_id":"WI-003","name":"Wetland indicator WI-003 — Freshwater Pond (PUBHx), parcel 731503000001","parcel_id":"731503000001","area_m2":8072.9},"geometry":{"type":"Polygon","coordinates":[[[-80.9850892,29.0330227],[-80.9858211,29.0333173],[-80.9856584,29.0335975],[-80.9856421,29.0336661],[-80.9856421,29.0337061],[-80.9856681,29.0337319],[-80.9857137,29.0337519],[-80.9857755,29.0337719],[-80.9858503,29.0337919],[-80.9859317,29.0338205],[-80.9859642,29.0338377],[-80.986013,29.0338663],[-80.9860455,29.0339006],[-80.9860585,29.0339349],[-80.986052,29.0339749],[-80.9859186,29.0341808],[-80.985808,29.0343723],[-80.985616,29.0346582],[-80.9855281,29.0346096],[-80.985437,29.0345581],[-80.9854338,29.0345124],[-80.9855379,29.0344438],[-80.985655,29.0343837],[-80.9856778,29.0343466],[-80.9856778,29.0342951],[-80.98559,29.0341579],[-80.9854892,29.0339749],[-80.9853428,29.0338004],[-80.9851802,29.0336603],[-80.9850435,29.0335431],[-80.9848809,29.0334744],[-80.9848223,29.0334144],[-80.9850892,29.0330227]]]}},{"type":"Feature","properties":{"layer":"wetland","feature_id":"WI-004","name":"Wetland indicator WI-004 — Freshwater Forested/Shrub Wetland (PSS1Fd), parcel 731510000006","parcel_id":"731510000006","area_m2":299.53},"geometry":{"type":"Polygon","coordinates":[[[-80.9932115,29.0237104],[-80.9931588,29.0237474],[-80.9922826,29.023737],[-80.992284,29.0237126],[-80.9932115,29.0237104]]]}},{"type":"Feature","properties":{"layer":"wetland","feature_id":"WI-005","name":"Wetland indicator WI-005 — Freshwater Pond (PUBHx), parcel 731510000006","parcel_id":"731510000006","area_m2":28857.93},"geometry":{"type":"Polygon","coordinates":[[[-80.9933556,29.0238146],[-80.9933826,29.025531],[-80.9933672,29.0255725],[-80.9932842,29.0255725],[-80.9931037,29.0255855],[-80.9921868,29.0255934],[-80.9919324,29.0255807],[-80.9919063,29.0255672],[-80.9919349,29.0237135],[-80.9919612,29.0237134],[-80.9922826,29.023737],[-80.9931588,29.0237474],[-80.9933095,29.0237492],[-80.9933556,29.0238146]]]}},{"type":"Feature","properties":{"layer":"wetland","feature_id":"WI-006","name":"Wetland indicator WI-006 — Freshwater Pond (PUBHx), parcel 732200000042","parcel_id":"732200000042","area_m2":6769.46},"geometry":{"type":"Polygon","coordinates":[[[-80.9922708,29.0168949],[-80.9922971,29.0180709],[-80.9922312,29.0181346],[-80.9921389,29.0180882],[-80.9913811,29.0169122],[-80.9922708,29.0168949]]]}},{"type":"Feature","properties":{"layer":"wetland","feature_id":"WI-007","name":"Wetland indicator WI-007 — Freshwater Pond (PUSCx), parcel 732200000042","parcel_id":"732200000042","area_m2":6582.82},"geometry":{"type":"Polygon","coordinates":[[[-80.9912624,29.0169207],[-80.9911726,29.0167843],[-80.9923999,29.016769],[-80.9924116,29.0168648],[-80.9924297,29.0172668],[-80.9924479,29.0176697],[-80.9924355,29.0176722],[-80.9924449,29.0182932],[-80.9925104,29.0185957],[-80.9925123,29.0186717],[-80.9925048,29.0186879],[-80.9924449,29.0187169],[-80.9912624,29.0169207]],[[-80.9922708,29.0168949],[-80.9913811,29.0169122],[-80.9921389,29.0180882],[-80.9922312,29.0181346],[-80.9922971,29.0180709],[-80.9922708,29.0168949]]]}},{"type":"Feature","properties":{"layer":"flood","feature_id":"FH-001","name":"Flood hazard FH-001 — Zone A, parcel 731500000044 (12,355.93 m²)","parcel_id":"731500000044","area_m2":12355.93,"zone":"A"},"geometry":{"type":"Polygon","coordinates":[[[-80.9775109,29.0310596],[-80.9775077,29.0310641],[-80.9775068,29.0310641],[-80.977504,29.0310507],[-80.9774883,29.0310298],[-80.9774649,29.0310152],[-80.9774394,29.0309907],[-80.9774306,29.0309649],[-80.9774365,29.030944],[-80.9774472,29.0309227],[-80.9774869,29.0308732],[-80.9774928,29.0308536],[-80.9774917,29.0308351],[-80.9774822,29.0308157],[-80.9774596,29.030787],[-80.9773833,29.0307109],[-80.9773292,29.0306634],[-80.9773059,29.0306228],[-80.9772736,29.0306153],[-80.9772186,29.0306316],[-80.9771681,29.0306318],[-80.9770808,29.0306567],[-80.9770248,29.0306836],[-80.9770058,29.0306971],[-80.9769789,29.0307267],[-80.9769713,29.0307539],[-80.9769517,29.030752],[-80.9769359,29.0307546],[-80.9769157,29.0307811],[-80.976874,29.0307877],[-80.9768483,29.030801],[-80.9768378,29.0308143],[-80.9768363,29.0308329],[-80.9768275,29.0308604],[-80.9768307,29.0308929],[-80.976807,29.03089],[-80.9768033,29.0308878],[-80.9768025,29.0308087],[-80.976801,29.0306712],[-80.9767995,29.0305337],[-80.976798,29.0303962],[-80.9767965,29.0302587],[-80.976795,29.0301212],[-80.9767935,29.0299837],[-80.9767919,29.0298462],[-80.9767904,29.0297087],[-80.9767889,29.0295712],[-80.9767874,29.0294337],[-80.9767859,29.0292962],[-80.9767844,29.0291587],[-80.9767818,29.028922],[-80.9767917,29.0289243],[-80.9768299,29.0289431],[-80.9768498,29.0289702],[-80.976838,29.0289933],[-80.9768657,29.0290139],[-80.9768756,29.0290343],[-80.9768776,29.0290651],[-80.9768745,29.0290859],[-80.9768497,29.0291059],[-80.9768388,29.0291307],[-80.9768632,29.029146],[-80.9768882,29.0291472],[-80.9769207,29.0291112],[-80.9769395,29.0291012],[-80.9769637,29.0290969],[-80.9770073,29.0291329],[-80.9770544,29.0291545],[-80.9770835,29.0291229],[-80.9770858,29.0291079],[-80.9770746,29.0290876],[-80.9770932,29.0290726],[-80.9774425,29.0292445],[-80.9774357,29.0292573],[-80.9774429,29.0292872],[-80.9774494,29.0293782],[-80.977441,29.0294552],[-80.9774443,29.0295535],[-80.9774531,29.0296277],[-80.9774523,29.029651],[-80.9774433,29.0296773],[-80.9774224,29.0297036],[-80.9773988,29.0297144],[-80.9773825,29.0297127],[-80.9773566,29.0297197],[-80.9773474,29.0297333],[-80.9773472,29.029769],[-80.9773604,29.0298079],[-80.9773832,29.0298396],[-80.9773934,29.0298739],[-80.9773943,29.0298896],[-80.9773907,29.0299228],[-80.9773786,29.0299729],[-80.9773581,29.0300512],[-80.9773406,29.0300995],[-80.9773379,29.0301214],[-80.9773382,29.0301804],[-80.9773313,29.0302095],[-80.9773344,29.0302347],[-80.9773297,29.0302616],[-80.9773142,29.0303075],[-80.9773164,29.0303445],[-80.977345,29.0303332],[-80.9773739,29.0303423],[-80.9774127,29.0303864],[-80.9774584,29.0304083],[-80.9774886,29.0303986],[-80.9775228,29.0303695],[-80.9775521,29.0303617],[-80.9775906,29.0303586],[-80.9776445,29.030359],[-80.9776624,29.0303705],[-80.9776958,29.0304188],[-80.9777604,29.0304665],[-80.9778082,29.0304867],[-80.9778351,29.030513],[-80.977883,29.0305061],[-80.9778917,29.0305127],[-80.9775109,29.0310596]]]}},{"type":"Feature","properties":{"layer":"flood","feature_id":"FH-002","name":"Flood hazard FH-002 — Zone A, parcel 731510000006 (34,493.20 m²)","parcel_id":"731510000006","area_m2":34493.2,"zone":"A"},"geometry":{"type":"Polygon","coordinates":[[[-80.9934011,29.0254746],[-80.9933852,29.0255239],[-80.9933672,29.0255725],[-80.9932842,29.0255725],[-80.9929764,29.0255947],[-80.9929025,29.0255958],[-80.9928895,29.0256776],[-80.9928773,29.025754],[-80.9927417,29.0257572],[-80.9926061,29.0257604],[-80.9925229,29.0257427],[-80.9924397,29.025725],[-80.9923265,29.0257337],[-80.9922133,29.0257424],[-80.99222,29.0256758],[-80.9922283,29.0255955],[-80.9919324,29.0255807],[-80.9918997,29.0255639],[-80.9918638,29.0255685],[-80.991747,29.0255875],[-80.9916287,29.0256068],[-80.9916798,29.0255228],[-80.9917308,29.0254388],[-80.9917368,29.0253218],[-80.9917428,29.0252048],[-80.9917781,29.0251345],[-80.9918135,29.0250642],[-80.9918393,29.0250415],[-80.9918556,29.0250271],[-80.9918547,29.0249631],[-80.9918525,29.0247935],[-80.9918509,29.024791],[-80.99181,29.0247357],[-80.991769,29.0246803],[-80.9917041,29.02455],[-80.9916392,29.0244197],[-80.9916161,29.0242278],[-80.9916375,29.0241249],[-80.991697,29.0240954],[-80.9918392,29.0240108],[-80.9918428,29.0240087],[-80.9918414,29.0238976],[-80.9918605,29.0237648],[-80.9919277,29.0237135],[-80.9932821,29.0237102],[-80.9933635,29.0238258],[-80.9933886,29.0245972],[-80.9934795,29.0246679],[-80.9934787,29.0246853],[-80.9934239,29.025279],[-80.9934032,29.0254668],[-80.9934011,29.0254746]]]}},{"type":"Feature","properties":{"layer":"flood","feature_id":"FH-003","name":"Flood hazard FH-003 — Zone A, parcel 732200000042 (6,659.32 m²)","parcel_id":"732200000042","area_m2":6659.32,"zone":"A"},"geometry":{"type":"Polygon","coordinates":[[[-80.9918711,29.0168913],[-80.9920461,29.0168923],[-80.9921121,29.0168974],[-80.9921507,29.0169049],[-80.9921742,29.0169125],[-80.9921786,29.0169147],[-80.992199,29.0169253],[-80.9922177,29.0169427],[-80.9922365,29.0169721],[-80.99225,29.0170098],[-80.9922594,29.0170711],[-80.9922587,29.0171591],[-80.9922651,29.0173954],[-80.9922861,29.0178185],[-80.9922906,29.0179816],[-80.9922866,29.0180316],[-80.992274,29.0180778],[-80.9922661,29.0180922],[-80.9922501,29.0181089],[-80.992231,29.0181184],[-80.9922077,29.0181203],[-80.9921789,29.0181115],[-80.9921637,29.0181025],[-80.9921296,29.0180706],[-80.9921,29.0180328],[-80.991956,29.0178238],[-80.9918635,29.017677],[-80.9915174,29.0171494],[-80.991476,29.0170807],[-80.9914527,29.0170253],[-80.9914484,29.016997],[-80.9914522,29.0169707],[-80.9914623,29.0169518],[-80.9914768,29.0169375],[-80.9914989,29.0169232],[-80.9915408,29.0169109],[-80.9915989,29.0169032],[-80.9917131,29.0168961],[-80.9918711,29.0168913]]]}}]};

var parcels = { type: 'FeatureCollection', features: PARCELS.features.filter(function (f) { return f.properties.layer === 'parcel'; }) };
var wetland = { type: 'FeatureCollection', features: PARCELS.features.filter(function (f) { return f.properties.layer === 'wetland'; }) };
var flood = { type: 'FeatureCollection', features: PARCELS.features.filter(function (f) { return f.properties.layer === 'flood'; }) };

function fmtCoverage(v) { return (v === null || v === undefined) ? 'unknown' : v + '%'; }

function parcelById(id) {
  for (var i = 0; i < PARCELS.features.length; i++) {
    var f = PARCELS.features[i];
    if (f.properties.layer === 'parcel' && f.properties.parcel_id === id) return f.properties;
  }
  return null;
}

function parcelFeatureById(id) {
  for (var i = 0; i < PARCELS.features.length; i++) {
    var f = PARCELS.features[i];
    if (f.properties.layer === 'parcel' && f.properties.parcel_id === id) return f;
  }
  return null;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function collectCoords(geom) {
  if (!geom) return [];
  if (geom.type === 'Point') return [geom.coordinates];
  if (geom.type === 'LineString' || geom.type === 'MultiPoint') return geom.coordinates;
  if (geom.type === 'Polygon' || geom.type === 'MultiLineString') return geom.coordinates.flat();
  if (geom.type === 'MultiPolygon') return geom.coordinates.flat(2);
  if (geom.type === 'GeometryCollection') {
    var out = [];
    (geom.geometries || []).forEach(function (g) { out.push.apply(out, collectCoords(g)); });
    return out;
  }
  return [];
}

function parcelPopupHtml(p) {
  /* flood_zones arrives as an array from the embedded data, but MapLibre's
     GeoJSON-to-vector-tile round trip JSON-stringifies array properties, so
     a real click hands us the string '["A", "X"]'. Accept both forms. */
  var zones = p.flood_zones;
  if (Array.isArray(zones)) { zones = zones.join(', '); }
  else if (typeof zones === 'string' && zones.charAt(0) === '[') {
    try { zones = JSON.parse(zones).join(', '); } catch (e) { /* keep the raw string */ }
  }
  return '<strong>' + p.parcel_id + '</strong><br>' +
    'Area: ' + p.area_m2.toLocaleString('en-US') + ' m&sup2; (' + p.area_acres.toFixed(3) + ' acres)<br>' +
    'Wetland overlap: ' + p.wetland_overlap_m2.toLocaleString('en-US') + ' m&sup2; (' + p.wetland_overlap_pct + '% of parcel), coverage ' + fmtCoverage(p.wetland_coverage_pct) + '<br>' +
    'Flood overlap: ' + p.flood_overlap_m2.toLocaleString('en-US') + ' m&sup2; (' + p.flood_overlap_pct + '% of parcel), coverage ' + fmtCoverage(p.flood_coverage_pct) + '<br>' +
    'Flood zones present: ' + (zones || 'unknown') +
    (p.flood_unknown_m2 > 0 ? '<br>Note: ' + p.flood_unknown_m2.toLocaleString('en-US') + ' m&sup2; (' + (p.flood_unknown_m2 / p.area_m2 * 100).toFixed(2) + '%) of this parcel lies outside the mapped flood extent — flood status there is unknown, not clear.' : '');
}

var map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {
      basemap: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      },
      aerial: {
        type: 'raster',
        tiles: ['https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        maxzoom: 16,
        attribution: 'Imagery: USDA, USGS The National Map: Orthoimagery'
      }
    },
    layers: [{ id: 'basemap', type: 'raster', source: 'basemap' },
      { id: 'aerial', type: 'raster', source: 'aerial', layout: { visibility: 'none' } }]
  },
  center: [-80.9869, 29.0257],
  zoom: 13.5,
  attributionControl: true,
  cooperativeGestures: true
});
map.addControl(new maplibregl.NavigationControl(), 'top-right');
map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');
map.addControl({ onAdd: function () { var el = document.getElementById('basemap-switcher'); el.classList.add('maplibregl-ctrl'); el.style.clear = 'right'; return el; }, onRemove: function () {} }, 'top-right');

map.on('load', function () {
  map.addSource('parcels', { type: 'geojson', data: parcels });
  map.addSource('wetland', { type: 'geojson', data: wetland });
  map.addSource('flood', { type: 'geojson', data: flood });
  map.addSource('imported', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });

  map.addLayer({ id: 'parcels-fill', type: 'fill', source: 'parcels',
    paint: { 'fill-color': '#3b82f6', 'fill-opacity': 0.25 } });
  map.addLayer({ id: 'parcels-line', type: 'line', source: 'parcels',
    paint: { 'line-color': '#1d4ed8', 'line-width': 2 } });
  map.addLayer({ id: 'wetland-fill', type: 'fill', source: 'wetland',
    paint: { 'fill-color': '#22c55e', 'fill-opacity': 0.45 } });
  map.addLayer({ id: 'wetland-line', type: 'line', source: 'wetland',
    paint: { 'line-color': '#15803d', 'line-width': 1.5 } });
  map.addLayer({ id: 'flood-fill', type: 'fill', source: 'flood',
    paint: { 'fill-color': '#f97316', 'fill-opacity': 0.55 } });
  map.addLayer({ id: 'flood-line', type: 'line', source: 'flood',
    paint: { 'line-color': '#c2410c', 'line-width': 1.5 } });
  map.addLayer({ id: 'imported-fill', type: 'fill', source: 'imported',
    paint: { 'fill-color': '#d946ef', 'fill-opacity': 0.25 } });
  map.addLayer({ id: 'imported-line', type: 'line', source: 'imported',
    paint: { 'line-color': '#a21caf', 'line-width': 2 } });
  map.addLayer({ id: 'imported-point', type: 'circle', source: 'imported',
    paint: { 'circle-color': '#d946ef', 'circle-radius': 5, 'circle-stroke-color': '#a21caf', 'circle-stroke-width': 1.5 } });

  var popup = new maplibregl.Popup({ closeButton: true, closeOnClick: true });

  map.on('click', function (e) {
    var feats = map.queryRenderedFeatures(e.point, { layers: ['parcels-fill', 'wetland-fill', 'flood-fill', 'imported-fill', 'imported-point'] });
    if (!feats.length) { popup.remove(); return; }
    var f = feats[0];
    var html;
    if (f.properties && f.properties.parcel_id && f.layer.id === 'parcels-fill') {
      /* Prefer the embedded record (identical values, arrays intact) over the
         worker round-tripped properties. */
      html = parcelPopupHtml(parcelById(f.properties.parcel_id) || f.properties);
    } else if (f.layer.id === 'wetland-fill') {
      var wp = parcelById(f.properties.parcel_id);
      html = '<strong>Wetland indicator</strong><br>' + f.properties.name + '.<br>' +
        'This indicator: ' + f.properties.area_m2.toLocaleString('en-US') + ' m&sup2;.<br>' +
        (wp ? wp.parcel_id + ' wetland overlap: ' + wp.wetland_overlap_m2.toLocaleString('en-US') + ' m&sup2; (' + wp.wetland_overlap_pct + '% of parcel), coverage ' + fmtCoverage(wp.wetland_coverage_pct) + '.' : '');
    } else if (f.layer.id === 'flood-fill') {
      var fp2 = parcelById(f.properties.parcel_id);
      html = '<strong>Flood hazard</strong><br>' + f.properties.name + '.<br>' +
        (fp2 ? fp2.parcel_id + ' flood overlap: ' + fp2.flood_overlap_m2.toLocaleString('en-US') + ' m&sup2; (' + fp2.flood_overlap_pct + '% of parcel), coverage ' + fmtCoverage(fp2.flood_coverage_pct) + '.' : '');
    } else {
      var name = (f.properties && (f.properties.name || f.properties.title)) || 'Imported feature';
      html = '<strong>' + escapeHtml(name) + '</strong><br>Imported from KML/KMZ (client-side only).' +
        ((f.properties && f.properties.description) ? '<br>' + escapeHtml(f.properties.description) : '');
    }
    popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
  });

  map.on('mousemove', function (e) {
    var feats = map.queryRenderedFeatures(e.point, { layers: ['parcels-fill', 'wetland-fill', 'flood-fill', 'imported-fill', 'imported-point'] });
    map.getCanvas().style.cursor = feats.length ? 'pointer' : '';
  });

  /* Basemap switcher (Streets | Aerial). Only the base raster swaps; centre,
     zoom, overlays, popups and KML import are unaffected. Streets is the
     default on every visit; the choice is not persisted. */
  function setBasemap(which) {
    if (which === 'aerial') {
      /* The USGS imagery tiles are transparent where the service has no
         coverage (open water returns a fully transparent tile), so keep the
         Streets layer underneath: where imagery is missing, the OSM
         pale-blue water shows instead of the blank map pane. The imagery
         layer stays on top everywhere it has tiles. */
      map.setLayoutProperty('basemap', 'visibility', 'visible');
      map.setLayoutProperty('aerial', 'visibility', 'visible');
    } else {
      map.setLayoutProperty('aerial', 'visibility', 'none');
      map.setLayoutProperty('basemap', 'visibility', 'visible');
    }
  }
  Array.prototype.forEach.call(document.querySelectorAll('input[name="basemap"]'), function (radio) {
    radio.addEventListener('change', function () { if (radio.checked) { setBasemap(radio.value); } });
  });

  /* Parcel jump select (M-03): fit to the parcel and open its popup at the
     bbox centre — the keyboard path to popup content. */
  document.getElementById('parcel-jump').addEventListener('change', function (e) {
    var id = e.target.value;
    if (!id) { return; }
    var feat = parcelFeatureById(id);
    if (!feat) { return; }
    var b = new maplibregl.LngLatBounds();
    var extended = false;
    collectCoords(feat.geometry).forEach(function (c) { if (Array.isArray(c) && c.length >= 2) { b.extend(c); extended = true; } });
    if (!extended) { return; }
    map.fitBounds(b, { padding: 40 });
    popup.setLngLat(b.getCenter()).setHTML(parcelPopupHtml(feat.properties)).addTo(map);
  });
});

function setLayerVisibility(baseId, visible) {
  var v = visible ? 'visible' : 'none';
  if (!map.getLayer(baseId + '-fill')) return;
  map.setLayoutProperty(baseId + '-fill', 'visibility', v);
  map.setLayoutProperty(baseId + '-line', 'visibility', v);
  if (baseId === 'imported') map.setLayoutProperty('imported-point', 'visibility', v);
}

document.getElementById('toggle-parcels').addEventListener('change', function (e) { setLayerVisibility('parcels', e.target.checked); });
document.getElementById('toggle-wetland').addEventListener('change', function (e) { setLayerVisibility('wetland', e.target.checked); });
document.getElementById('toggle-flood').addEventListener('change', function (e) { setLayerVisibility('flood', e.target.checked); });
document.getElementById('toggle-imported').addEventListener('change', function (e) { setLayerVisibility('imported', e.target.checked); });

document.getElementById('fit-btn').addEventListener('click', function () {
  var b = new maplibregl.LngLatBounds([-80.99701, 29.01318], [-80.97678, 29.03829]);
  map.fitBounds(b, { padding: 40 });
});

document.getElementById('clear-import-btn').addEventListener('click', function () {
  if (map.getSource('imported')) map.getSource('imported').setData({ type: 'FeatureCollection', features: [] });
  document.getElementById('kml-file').value = '';
  document.getElementById('import-status').textContent = 'Imported features cleared.';
});

document.getElementById('kml-file').addEventListener('change', function (e) {
  var file = e.target.files && e.target.files[0];
  var status = document.getElementById('import-status');
  if (!file) return;
  var isKmz = /\.kmz$/i.test(file.name);
  var done = function (kmlText) {
    try {
      var doc = new DOMParser().parseFromString(kmlText, 'text/xml');
      if (doc.getElementsByTagName('parsererror').length) throw new Error('not valid XML');
      var gj = toGeoJSON.kml(doc);
      var feats = (gj && gj.features) || [];
      if (map.getSource('imported')) map.getSource('imported').setData(gj);
      status.textContent = 'Imported ' + feats.length + ' feature(s) from ' + file.name + ' (parsed in your browser only — nothing was uploaded).';
      if (feats.length) {
        var b = new maplibregl.LngLatBounds();
        var extended = false;
        feats.forEach(function (f) {
          if (!f.geometry) return;
          collectCoords(f.geometry).forEach(function (c) { if (Array.isArray(c) && c.length >= 2) { b.extend(c); extended = true; } });
        });
        if (extended) map.fitBounds(b, { padding: 40 });
      }
    } catch (err) {
      status.textContent = 'Could not parse ' + file.name + ': ' + err.message;
    }
  };
  if (isKmz) {
    file.arrayBuffer().then(function (buf) {
      return JSZip.loadAsync(buf);
    }).then(function (zip) {
      var kmlName = Object.keys(zip.files).find(function (n) { return /\.kml$/i.test(n); });
      if (!kmlName) throw new Error('no .kml file found inside the KMZ');
      return zip.file(kmlName).async('string');
    }).then(done).catch(function (err) {
      status.textContent = 'Could not read ' + file.name + ': ' + err.message;
    });
  } else {
    file.text().then(done).catch(function (err) {
      status.textContent = 'Could not read ' + file.name + ': ' + err.message;
    });
  }
  e.target.value = '';
});
