import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    keywords:" ",
    offer: false,
    villa:false,
    bunglow:false,
    appartment:false,
    townhouse:false,
    condominum:false,
    duplex:false,
    triplex:false,
    other:false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const keywordsFromUrl = urlParams.get('keywords');
    const villaFromUrl = urlParams.get('villa');
    const bunglowFromUrl = urlParams.get('bunglow');
    const appartmentFromUrl = urlParams.get('appartment');
    const townhouseFromUrl = urlParams.get('townhouse');
    const condomiumFromUrl = urlParams.get('condomium');
    const duplexFromUrl = urlParams.get('duplex');
    const triplexFromUrl = urlParams.get('triplex');
    const otherFromUrl = urlParams.get('other');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      keywordsFromUrl||
      villaFromUrl ||
      bunglowFromUrl ||
      appartmentFromUrl ||
      townhouseFromUrl ||
      condomiumFromUrl ||
      duplexFromUrl ||
      triplexFromUrl ||
      otherFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        villa: villaFromUrl === 'true' ? true : false,
        keywords:keywordsFromUrl===' ',
        bunglow: bunglowFromUrl === 'true' ? true : false,
        appartment: appartmentFromUrl === 'true' ? true : false,
        townhouse: townhouseFromUrl === 'true' ? true : false,
        condominum: condomiumFromUrl === 'true' ? true : false,
        duplex: duplexFromUrl === 'true' ? true : false,
        triplex: triplexFromUrl === 'true' ? true : false,
        other: otherFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'||
      e.target.id === 'keywords'

    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'villa' ||
      e.target.id === 'keywords' ||
      e.target.id === 'bunglow' ||
      e.target.id === 'townhouse'||
      e.target.id === 'apartment'||
      e.target.id === 'condominum'||
      e.target.id === 'duplex'||
      e.target.id === 'triplex'||
      e.target.id === 'other'||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('villa', sidebardata.villa);
    urlParams.set('bunglow', sidebardata.bunglow);
    urlParams.set('appartment', sidebardata.appartment);
    urlParams.set('townhouse', sidebardata.townhouse);
    urlParams.set('condomium', sidebardata.condominum);
    urlParams.set('duplex', sidebardata.duplex);
    urlParams.set('triplex', sidebardata.triplex);
    urlParams.set('other', sidebardata.other);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className='flex flex-col md:flex-row'>
    <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen bg-gray-100'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Search Term:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='all'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'all'}
              />
              <span>Rent & Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'sale'}
              />
              <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>
            <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
            </div>
            
            <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Property types</label>
           
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='villa'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.villa}
              />
              <span>villa</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='bunglow'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.bunglow}
              />
              <span>bunglow</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='appartment'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.appartment}
              />
              <span>appartment</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='townhouse'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.townhouse}
              />
              <span>townhouse</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='condominum'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.condominum}
              />
              <span>condominum</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='duplex'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.duplex}
              />  
              <span>duplex</span>
            </div>
            </div>
            <div className='flex gap-2 flex-wrap items-center'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='triplex'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.triplex}
              />
              <span>triplex</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='other'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.other}
              />
              <span>other</span>
            </div>

            
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg p-3'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to hight</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>
        </form>
      </div>
      <div className='flex-1 bg-white'>
        <h1 className='text-3xl font-extrabold text-gray-500'>
          Listing results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listing found!</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-green-700 hover:underline p-7 text-center w-full'
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
