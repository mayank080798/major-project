const router                = require('express').Router();
const {ensureAuthenticated} = require('../config/authorization');
const Products              = require('../models/product');
router.get('/',async (request,response)=>{
    console.log(process.pid);
    let perPage=3;
    let page=request.params.page || 1;
    Products.find({})
        .skip((perPage*page)-perPage)
        .limit(perPage).exec(function(error,data){
            if(error)
                throw new Error();
            let bucket = 0;
            if(request.session.cart)
                bucket = request.session.cart.totalQty > 0 ? request.session.cart.totalQty : 0;            
            Products.countDocuments({}).exec((error,count)=>{
                response.render('product',{
                    //bucket:request.session.cart.totalQty,
                    records:data,
                    current:page,
                    pages:Math.ceil(count/perPage),
                    user:request.user,
                    bucket:bucket,
                });
            })
        })
});


router.get('/hello',async (request,response)=>{
    // const product = new Products({
    //     'name':'Dell PowerEdge T30',
    //     'tagline':'A Xeon dream with plentiful connectivity on offer',
    //     'thumbnail':'https://cdn.mos.cms.futurecdn.net/Vj2VgZBMZv2Ac62LsCqhwa-650-80.jpg.webp',
    //     'features.first':'fast quad-core Xeon processor',
    //     'features.second':'Room for six internal disks',
    //     'features.third':'Single Gigabit network port',
    //     'features.fourth':'No hot-swapping of disks',
    //     'specifications.CPU':' Intel Xeon E3-1225 v5',
    //     'specifications.Graphics':'Intel HD Graphics P530',
    //     'specifications.RAM':'64GB',
    //     'specifications.Storage':'Up to six SATA HDD ',
    //     'specifications.Connectivity':'10 x USB ports, HDMI, DisplayPort, VGA, serial, PS2, Gigabit Ethernet',
    //     'specifications.Dimensions':'17.5 x 43.5 x 36cm',
    //     'data':'There are so many different servers out there, and that means that you’ll sometimes have to sort through entire price lists in order to find the best small server for you. Just look at the Dell PowerEdge T30 – you can buy it either as a barebones or as a fully configured server. Aimed at the entry-level/SoHo market, the T30 manages to fit in a ton of expansion potential into a tiny, mini-tower-like chassis, and it even comes with a wealth of server features by default, which makes it a perfect alternative to an office workstation.'
    // });

    // const product = new Products({
    //     'name':'Dell PowerEdge T20 [barebones]',
    //     'tagline' : 'Shows you how cheap a barebones server can get',
    //     'thumbnail':'https://cdn.mos.cms.futurecdn.net/1abd303eaaa3a898c0720121b011750e-970-80.jpg.webp',
    //     'features.first':'Very cheap',
    //     'features.second':'Compact mini-tower with easy access to internals',
    //     'features.third':'G3220 is more a desktop than server CPU',
    //     'features.fourth':'No drives or OS',
    //     'specifications.CPU':'Intel Pentium G3220',
    //     'specifications.Graphics':'Intel HD Graphics',
    //     'specifications.RAM':'4GB',
    //     'specifications.Storage':'No drivers included',
    //     'specifications.Connectivity':'Up to 12 x USB ports (4 x USB 3.0), 2 x DisplayPort, VGA, serial, 2 x PS2, Gigabit Ethernet',
    //     'specifications.Dimensions':'17.5 x 43.5 x 36cm',
    //     'data':'Servers do not have to be massive or expensive. Take the PowerEdge T20 for example; it has benefited from a wealth of knowledge derived from the 20 years of experience Dell has building servers. While the barebones version doesnt have a hard drive,its certainly cheap – in the recent past, it has been priced at less than £100 (with cashback offers, that is – it’s always well worth keeping an eye out for these).It has a Haswell-based Pentium processor that can clock up to 3GHz and supports up to 32GB DDR3 ECC RAM (note that this model comes with 4GB). Expansion capabilities include four SATA ports (32TB if you use 8TB hard drives), four I/O slots and 10 USB ports. Astoundingly for a PC of this price, you also get two DisplayPort connectors, a VGA one, two PS2 and one serial port. Other than a Gigabit Ethernet port, the other points of interest are a 290W PSU and an Intel-based RAID controller.',

    // });


    // const product = new Products({
    //     'name':'Lenovo ThinkServer TS150',
    //     'tagline':'A Tower server offering quite potent performance',
    //     'thumbnail':'https://cdn.mos.cms.futurecdn.net/23iHswRrvedtNtZhSEhEvS-650-80.jpg.webp',
    //     'features.first':'Most affordable ThinkServer model',
    //     'features.second':'Whisper quiet',
    //     'features.third':'Not much to complain about',
    //     'specifications.CPU':'Intel Xeon E3-1200 v6',
    //     'specifications.Graphics':'Intel HD Graphics',
    //     'specifications.RAM':'Up to 64GB',
    //     'specifications.Storage':'Up to 40TB HDD',
    //     'specifications.Connectivity':'8 x USB 3.0, serial, video, 2 x DisplayPort, audio, Gigabit Ethernet',
    //     'specifications.Dimensions':'17.5 x 37.5 x 43cm',
    //     'data':"Lenovo took over IBM's x86 server range back in 2014 and has built on the best of the ThinkServer tradition. The TS150 is now the most affordable of the range and is a 4U enterprise-class server that competes with the Dell T20. It comes with support for RAID 0,1,10 and 5 (via an on-board controller). Like the competition, this one can accommodate up to four 3.5-inch HDDs in total, which means that it can go up to 40TB of storage when loaded with the relevant hard drives. The relatively-recent Intel Xeon E3-1200 v6 processor should be powerful enough for small and medium enterprises.Lenovo also claims that the acoustics of the TS150 are even quieter than a typical library at 26 decibels. As is the case for the competition, you also get an impressive array of ports and connectors: eight USB ports, four PCI/PCI-e slots, three video connectors (including a pair of DisplayPorts), Serial, Gigabit Ethernet and three audio connectors."
    // });
    

    // const product = new Products({
    //     'name':'HPE ProLiant ML350 Gen 10',
    //     'tagline':'Powerful and versatile',
    //     'thumbnail':'https://cdn.mos.cms.futurecdn.net/UwRbzQt3nsTDhPXY7n6783-650-80.jpg.webp',
    //     'features.first':'Scalable',
    //     'features.second':'Decent design',
    //     'features.third':'A hefty beast of a machine',
    //     'features.fourth':"Doesn't come with hard drives",
    //     'specifications.CPU':'Intel Xeon Scalable 4210',
    //     'specifications.Graphics':'Intel HD Graphics P530',
    //     'specifications.RAM':'16GB',
    //     'specifications.Storage':'No drivers included',
    //     'specifications.Connectivity':'8 x USB 3.0, serial, video, 2 x DisplayPort, audio, Gigabit Ethernet',
    //     'specifications.Dimensions':'18 x 65 x 47cm',
    //     'data':"If you're after a robust, yet versatile, server for your small business, then the HPE ProLiant ML350 Gen 10 is an excellent choice. Packed with Intel Xeon Scalable processors, this offers a big performance boost over the previous models. You need to fit your own storage, but it supports a wide range of fast options, as well as wide support for graphics and compute options as well. While it starts out as a tower server, as your business grows, the HPE ProLiant ML350 Gen 10 can be turned into a rack server for an affordable way to keep your business going without having to buy a new server altogether."
    // });
    
    // const product = new Products({
    //     'name':'HP Proliant Microserver Gen8',
    //     'tagline':'A compact if slightly noisy server',
    //     'thumbnail':'https://cdn.mos.cms.futurecdn.net/27f614bda389b50aa564751ca7bb2a91-650-80.jpg.webp',
    //     'features.first':'Two Gigabit network ports',
    //     'features.second':'Choice of Intel dual-core processors',
    //     'features.third':'No hot-swap disks',
    //     'features.fourth':"Could be quieter",
    //     'specifications.CPU':'Intel Celeron G1610T',
    //     'specifications.Graphics':'Matrox G200',
    //     'specifications.RAM':'4GB',
    //     'specifications.Storage':'No drivers included',
    //     'specifications.Connectivity':'4 x USB 2.0, 2 x USB 3.0, VGA, 2 x Gigabit Ethernet',
    //     'specifications.Dimensions':'23 x 24.5 x 23cm',
    //     'data':"One of the fastest growing segments of the server market is dominated by a single company. HP Enterprise's Proliant Microserver Gen8 has successfully managed to fend off competition – thanks to an attractive feature mix and plenty of discounts – and ultimately own this market. These tiny servers have found a market well outside their niche with prosumers buying them en masse and touting their obvious advantages over NAS (network attached storage).Despite being very small (less than 13l in volume) and light (less than 7kg), this machine packs some impressive capabilities. We're talking support for Intel's Xeon E3 family, up to 16GB of RAM, on system management processor, two Gigabit Ethernet ports, one PCIe slot, support for RAID 0/1/10, a DVD writer, up to four hard disk drives, an internal microSD card slot, an integrated Matrox G200 graphics chip and seven USB ports. It only has a VGA port, though, and has just two memory modules.",
    // });


    // const product = new Products({
    //     'name':'Lenovo ThinkServer TS460',
    //     'tagline':'A beefy server that can handle up to eight drives',
    //     'thumbnail':'https://cdn.mos.cms.futurecdn.net/95b241413b6bf5dfb0edb0fa1ba4e603-650-80.jpg.webp',
    //     'features.first':'Impressive performer',
    //     'features.second':'Three-year onsite warranty',
    //     'features.third':'Not cheap',
    //     'features.fourth':"A big machine",
    //     'specifications.CPU':'Xeon E3-1200 v6',
    //     'specifications.Graphics':'Intel HD Graphics P630',
    //     'specifications.RAM':'Up to 64GB',
    //     'specifications.Storage':'2x external fixed 5.25-inch bays, maximum storage 80TB',
    //     'specifications.Connectivity':'6 x USB 3.0, serial, video, 2 x Gigabit Ethernet',
    //     'specifications.Dimensions':'4.4 x 58.3 x 17.3cm',
    //     'data':"If you want something a bit beefier than the aforementioned servers, then consider the TS460. It is far more expensive but then again you get a server that's in another league. For a start, it is far bigger than the previously mentioned servers with a 50 litre volume and a 25kg weight. This 5U server runs on Intel's Xeon E3 models with Turbo Boost technology plus it offers a three-year onsite warranty.It supports up to 64GB of RAM and its integrated RAID controller offers the four main RAID types. You get a DVD writer, four fans, a 300W PSU and two Gigabit Ethernet ports. Up to eight hard disk drives can be installed and there are a whopping eight USB ports as well. There's a lockable door, support for ECC memory, plus a serial and a VGA connector.",
    // });

    
    // const product = new Products({
    //     'name':'HP ProLiant ML350 G9 5U',
    //     'tagline':'Extremely well-featured server offering plenty of power',
    //     'thumbnail':'https://cdn.mos.cms.futurecdn.net/66eddb01efca33706baa5c077223cfdc-650-80.jpg.webp',
    //     'features.first':'Six-core Xeon CPU',
    //     'features.second':'Three-year onsite NDB warranty',
    //     'features.third':"It'll certainly dent your wallet",
    //     'features.fourth':"Not much else to complain about",
    //     'specifications.CPU':'Intel Xeon E5-2603 v3 ',
    //     'specifications.Graphics':'Matrox G200',
    //     'specifications.RAM':'8GB',
    //     'specifications.Storage':'2x external fixed 5.25-inch bays, maximum storage 80TB',
    //     'specifications.Connectivity':'4 x Gigabit Ethernet ',
    //     'specifications.Dimensions':'4.4 x 58.3 x 17.3cm',
    //     'data':"Pitching in the same category as the TS440 is the ML350. This is an expensive piece of kit but just look at the feature list and it actually seems like a very decent deal. Other than the fact that it has a dedicated, integrated graphics card (Matrox G200), it offers a three-year onsite next business day warranty, four Gigabit Ethernet ports and support for 12Gbps SAS (note that it takes only 2.5-inch drives),But there's more – this server runs an Intel Xeon E5-2603 v3 processor (not the usual E3 CPU) and supports two CPUs. The E5 has six cores which makes it particularly well-suited for more taxing tasks. We are also impressed by the amount of memory slots (24) that it has, allowing it to hit 3TB of memory once 128GB LRDIMM roll out. Oh and other than a lockable front door and a storage controller, this server earns brownie points for having dual redundant, hot-swappable 500W PSUs",
    // });


    // const product = new Products({
    //     'name':'Scan 3XS SER-T25',
    //     'tagline':'A beast driven by twin Xeon processors',
    //     'thumbnail':'https://cdn.mos.cms.futurecdn.net/281d6b27978b5dbaf0c12770f4a3a675-650-80.jpg.webp',
    //     'features.first':'Compact and quiet',
    //     'features.second':'Very powerful',
    //     'features.third':"Not the cheapest (but well-priced given its power)",
    //     'features.fourth':"Any other complaint would be nit-picking",
    //     'specifications.CPU':'Dual Intel Xeon E5-2603 v4',
    //     'specifications.Graphics':'Nvidia GT 610',
    //     'specifications.RAM':'64GB',
    //     'specifications.Storage':'1TB HDD',
    //     'specifications.Connectivity':'2 x Gigabit Ethernet',
    //     'specifications.Dimensions':'23.2 x 56 x 55.9cm',
    //     'data':"A powerful server doesn't have to be expensive – that's essentially what Scan wants to convey to prospective customers. Specifically designed for the SMB market, this 3XS offering is engineered to be compact and as quiet as possible. The UK-based vendor provides real-time tracking at every stage of the server build process (the servers are built to order, and production includes a 24 hour burn test and 88 point QC check ). Each comes with a three-year onsite warranty; what's more, you get a free recovery USB stick with diagnostic utilities.If that wasn't enough, the components used in the system are amongst the best in our round-up. Two Broadwell-based Intel Xeon E5-2603 v4 processors provide a total of 12 cores and 30MB of cache. Then there's 64GB of DDR4 ECC RAM from Samsung, a 1TB WD Enterprise-class hard disk drive, two Intel Gigabit Ethernet ports, a 1000W Gold PSU and support for eight hard disk drives. Built by Corsair, the case has a door and all the panels are lined with noise damping material.",
    // });

    // const product = new Products({
    //     'name':'Asus TS500',
    //     'tagline':'A mainstream tower server with flexibility in spades',
    //     'thumbnail':'https://cdn.mos.cms.futurecdn.net/03b7aa642bd2614bd76c4380eff5f12d-650-80.jpg.webp',
    //     'features.first':'Perfect for server and workstation use',
    //     'features.second':'No shortage of power and flexibility',
    //     'features.third':"Not everyone will need all those features",
    //     'features.fourth':"Seeing the Asus label may surprise some",
    //     'specifications.CPU':'Intel Xeon E5-2600 v3',
    //     'specifications.Graphics':'Nvidia GT 610',
    //     'specifications.RAM':'As ordered',
    //     'specifications.Storage':'1TB HDD',
    //     'specifications.Connectivity':'8 x USB ports, VGA, PS2, 3 x Gigabit Ethernet',
    //     'specifications.Dimensions':'22 x 54.5 x 45.5cm',
    //     'data':"Like Supermicro, Asus is not well known for its servers. Instead, the Taiwanese company, one of the biggest component vendors in the world, is popular for a wide range of consumer products including its motherboards. Its TS500-E8-PS4 is a mainstream pedestal 5U tower server perfectly built for both workstation and server dual use.t features the latest Intel Xeon processor E5-2600 v3 product families, eight DDR4 DIMMs (supporting half a terabyte of RAM), six expansion slots, three 5.25-inch media bays and a single 500W 80 Plus Bronze power supply. There are four 3.5-inch hot-swap SATA/SAS HDD bays which is also upgradable to eight HDD bays for flexible storage requirements.n addition, with Intel's Intelligent Platform Management Interface (IPMI) 2.0-compliant ASMB8-iKVM module in the TS500 you'll be able to monitor, control and manage the server remotely. Other key specs include 10 SATA ports, a DVD writer, eight USB ports, a PS2 port, a VGA one and three Gigabit Ethernet ports. Note that this is a barebones server, but obviously that gives you plenty of flexibility - something this machine offers in spades.",
    // });

    
    // const product = new Products({
    //     'name':'Fujitsu Primergy TX1310 M1',
    //     'tagline':"Fujitsu's reliability guarantee is second to none",
    //     'thumbnail':'https://cdn.mos.cms.futurecdn.net/0710a595c81cfe9e5c59393106f161b0-970-80.jpg.webp',
    //     'features.first':'Fantastic guarantee',
    //     'features.second':'Has an optical drive',
    //     'features.third':'No RAID 5',
    //     'features.fourth':"Fujitsu isn't the first brand you'd think of",
    //     'specifications.CPU':' Intel Xeon E3-1226 v3',
    //     'specifications.Graphics':'Intel HD Graphics P4600',
    //     'specifications.RAM':'16GB',
    //     'specifications.Storage':'2 x 1TB HDD',
    //     'specifications.Connectivity':'5 x USB 3.0, 2 x Gigabit Ethernet',
    //     'specifications.Dimensions':'17.5 x 42 x 39.5cm',
    //     'data':'When you think about servers, Fujitsu is probably not the first vendor which springs to mind. And yet, the Japanese manufacturer is one of the very few (if not the only one) that can claim to be involved in anything from SMB servers to, well, supercomputers. The TX1310 is its entry-level, SMB-focused server and comes with some pretty solid credentials plus an unmatched, industry-leading reliability guarantee. If your server breaks down within the first year of purchase, not only will Fujitsu fix or replace it, the company will also refund you the amount you paid for the server.Like pretty much everyone at this end of the market, it is designed to run silently 24/7 and offers RAID 0/1/10 but not 5. This model incudes an Intel Xeon E3-1226 v3, two 1TB hard drives and 16GB of RAM. We like the fact that it comes with an optical drive and has two Gigabit Ethernet ports for redundancy. With four DIMM slots and four storage bays, this server supports up to 32TB of storage and 32GB of memory.'
    // });

    // const product = new Products({
    //     'name':'Dell PowerEdge R730xd',
    //     'tagline':"Redefining server-based storage flexibility",
    //     'thumbnail':'https://i.dell.com/is/image/DellContent//content/dam/global-site-design/product_images/dell_enterprise_products/enterprise_systems/poweredge/poweredge_r730xd/pdp/server-poweredge-r730xd-pdp-ng-hero-static-v2.jpg?fmt=jpg&wid=570&hei=400',
    //     'features.first':'Suitable for Demanding Workloads',
    //     'features.second':'Huge Storage Density for Clouds',
    //     'features.third':'No RAID 5',
    //     'features.fourth':"Any other complaint would be nit-picking",
    //     'specifications.CPU':'Intel® Xeon® E5 2600 v3 processors',
    //     'specifications.Graphics':'Intel HD Graphics P4600',
    //     'specifications.RAM':'1.5TB',
    //     'specifications.Storage':'131.6TB',
    //     'specifications.Connectivity':'5 x USB 3.0, 2 x Gigabit Ethernet',
    //     'specifications.Dimensions':'18 x 1.8″ , 26 x 2.5″, 16 x 3.5″',
    //     'data':'Are you looking for a low-cost server with huge processing power, extremely good storage options, and high-performance memory that can run mission-critical applications at ease? Dell PowerEdge R730xd rack server is a powerful workhorse that is built with advanced technologies that offer a perfect solution for your most demanding tasks. This industrial grade server is exclusively designed for small and medium businesses, you can customize the server as per your company needs.  Dell R730xd supports DDR3 Memory and a wide range of storage options that make this server suitable for various workloads, including web hosting, email server, etc. Purchase Grade “A” quality Dell PowerEdge R730xd server from Server Basket at an offer price, Server Basket is the only online store in India where you can buy a server at a discounted price. With the best price in India, we also provide free installation assistance, free quote, lightning-fast delivery, and a 1-year warranty.With incredible range of features including highly expandable memory, impressive storage options and the latest Intel Xeon E5-2600 V4 processors, the used Dell PowerEdge R730xd can easily handle the most complex workloads of organization of any size, be it a small and medium business or a large enterprise. It can be used for mid-level medical imaging, High performance computing applications, you can also create powerful virtual environment with this highly scalable server.'
    // });

    // const product = new Products({
    //     'name':'IBM HS23 (7875IO6) Blade Server',
    //     'tagline':"Redefining server-based storage flexibility",
    //     'thumbnail':'',
    //     'features.first':'RAID is integrated 01 (LS1 SAS 2004)',
    //     'features.second':'Outstanding performance',
    //     'features.third':'Not cheap',
    //     'features.fourth':"A big machine",
    //     'specifications.CPU':'Intel Xeon E5 2609(Quad core)',
    //     'specifications.Graphics':'Intel HD Graphics P4600',
    //     'specifications.RAM':'2 TB',
    //     'specifications.Storage':'512 GB',
    //     'specifications.Connectivity':'5 x USB 3.0, 2 x Gigabit Ethernet',
    //     'specifications.Dimensions':'18 x 1.8″ , 26 x 2.5″, 16 x 3.5″',
    //     'data':'IBM HS23 (7875IO6) Blade server supports Intel Xeon E5-2650, Intel Xeon E5-2660, Intel Xeon E5-2430 processors and has maximum server scalable memory 512 GB and maximum storage up to 2 TB, it contains SAS/SATA hard disk controller.The latest model HS23 is packed with new abilities that will help in boosting the clients work. In the new IBM HS23 comes with a standard memory option of 8GB 1600 MHz, 1333 MHz or an 1866 MHz DDR3 VLP RDIMMs. You can choose from Chipkill reliability or from the dual rank that will help in obtaining max work along with your Intel Xeon ™ Processor E5-2600 v2. According to your requirement you can even expand the memory to 512 GB.When it comes to hs23 blade server, we will give outstanding performance, flexible networking and simple management integrated tools one does not want to compromise on quality. The IBM HS23 server is the ideal best buy as the performance is based on the ServerBlade architecture meant for larger business to be able to run efficiently.'
    // });
    
    await product.save();
    console.log('Saved');
    response.send('Hello');


})




router.get('/:page',async (request,response)=>{

    let perPage=3;
    let page=request.params.page || 1;
    
    Products.find({})
        .skip((perPage*page)-perPage)
        .limit(perPage).exec(function(error,data){
            if(error)
                throw new Error();
            let bucket = 0;
            if(request.session.cart)
                    bucket = request.session.cart.totalQty > 0 ? request.session.cart.totalQty : 0;  
            Products.countDocuments({}).exec((error,count)=>{
                response.render('product',{
                    //bucket:request.session.cart.totalQty,
                    records:data,
                    current:page,
                    pages:Math.ceil(count/perPage),
                    user:request.user,
                    bucket:bucket ,
                });
            });
        });
});




router.get('/info/:id',async(request,response)=>{
    const id=request.params.id;
    const product=await Products.findById(id);
    let bucket = 0;
    if(request.session.cart)
        bucket = request.session.cart.totalQty > 0 ? request.session.cart.totalQty : 0;
    response.render('productDescription',{
        //bucket:request.session.cart.totalQty,
        user:request.user,
        record:product,
        keys:Object.keys(product.specifications),
        values:Object.values(product.specifications),
        bucket:bucket,
    });
    
})






module.exports=router;