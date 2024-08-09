import React, { useEffect, useRef } from 'react';
import axios from 'axios';

const restaurants = [
  { name: 'Restaurant A', lat: 37.5665, lng: 126.978 },
  { name: 'Restaurant B', lat: 37.5651, lng: 126.9827 },
  { name: 'Restaurant C', lat: 37.5673, lng: 126.9833 },
];

const Map = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const { naver } = window;
    if (!mapRef.current || !naver) return;

    const mapOptions = {
      center: new naver.maps.LatLng(37.5665, 126.978),
      zoom: 13,
    };

    const map = new naver.maps.Map(mapRef.current, mapOptions);

    navigator.geolocation.getCurrentPosition(async (position) => {
      const userLocation = new naver.maps.LatLng(position.coords.latitude, position.coords.longitude);

      new naver.maps.Marker({
        position: userLocation,
        map: map,
        title: '내 위치',
      });

      map.setCenter(userLocation);

      restaurants.forEach((restaurant) => {
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(restaurant.lat, restaurant.lng),
          map: map,
          title: restaurant.name,
        });

        naver.maps.Event.addListener(marker, 'click', async () => {
          try {
            const response = await axios.get('http://localhost:8000/api/map', {
              params: {
                startLat: position.coords.latitude,
                startLng: position.coords.longitude,
                endLat: restaurant.lat,
                endLng: restaurant.lng,
              },
            });

            const route = response.data.route.trafast[0].summary; // Directions15의 결과를 사용
            console.log('route: ', route.distance.text);
            console.log('route: ', route.distance);
            alert(`${restaurant.name}까지의 거리: ${route.distance}, 예상 시간: ${route.duration}`);

            const path = new naver.maps.Polyline({
              map: map,
              path: response.data.route.trafast[0].path.map((point) => new naver.maps.LatLng(point[1], point[0])),
              strokeColor: '#5347AA',
              strokeWeight: 5,
            });
          } catch (error) {
            alert('경로 정보를 불러오는 중 오류가 발생했습니다.');
          }
        });
      });
    });
  }, []);

  return <div ref={mapRef} className="map" />;
};

export default Map;
