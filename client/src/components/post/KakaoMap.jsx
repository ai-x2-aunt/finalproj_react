import React, { useEffect, useState } from 'react';
import '../../assets/css/KakaoMap.css';

const KakaoMap = ({ address }) => {
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const initMap = () => {
      if (window.kakao && window.kakao.maps) {
        try {
          window.kakao.maps.load(() => {
            const container = document.getElementById('map');
            const geocoder = new window.kakao.maps.services.Geocoder();

            geocoder.addressSearch(address, function(result, status) {
              if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                const options = {
                  center: coords,
                  level: 3
                };
                const map = new window.kakao.maps.Map(container, options);
                
                // 마커 생성
                const marker = new window.kakao.maps.Marker({
                  map: map,
                  position: coords
                });

                // 지도 중심을 마커 위치로 설정하고 약간 왼쪽으로 이동
                map.setCenter(coords);
                map.panBy(-100, 0);
              }
            });
          });
        } catch (error) {
          console.error('카카오맵 초기화 에러:', error);
          setMapError(true);
        }
      } else {
        // 카카오맵 SDK가 아직 로드되지 않은 경우 재시도
        setTimeout(initMap, 300);
      }
    };

    initMap();
  }, [address]);

  if (mapError) {
    return <div className="map-container map-error">지도를 불러올 수 없습니다.</div>;
  }

  return <div id="map" className="map-container" />;
};

export default KakaoMap;
