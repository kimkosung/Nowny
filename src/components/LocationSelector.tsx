import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {BottomSheetDefaultBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
const {height} = Dimensions.get('window');

// 타입 정의
type District = string;
type Dong = string;

interface City {
  city: string;
  districts: District[];
}

interface Region {
  region: string;
  locations: City[];
}

interface LocationSelectorProps {
  currentLocation?: string;
  onLocationChange: (location: string) => void;
}

// 지역 데이터 구조
const locationData: Region[] = [
  {
    region: '수도권',
    locations: [
      {
        city: '서울',
        districts: ['강남구', '서초구', '송파구', '마포구', '용산구'],
      },
      {
        city: '경기',
        districts: ['성남시', '부천시', '수원시', '용인시', '고양시'],
      },
      {city: '인천', districts: ['연수구', '남동구', '부평구', '서구', '중구']},
    ],
  },
  {
    region: '부산/경상',
    locations: [
      {
        city: '부산',
        districts: ['해운대구', '부산진구', '남구', '수영구', '동래구'],
      },
      {city: '대구', districts: ['중구', '수성구', '달서구', '북구', '동구']},
      {city: '울산', districts: ['남구', '중구', '동구', '북구', '울주군']},
    ],
  },
  {
    region: '대전/충청',
    locations: [
      {city: '대전', districts: ['유성구', '서구', '중구', '동구', '대덕구']},
      {city: '청주', districts: ['흥덕구', '상당구', '서원구', '청원구']},
      {city: '천안', districts: ['동남구', '서북구']},
    ],
  },
  {
    region: '광주/전라',
    locations: [
      {city: '광주', districts: ['서구', '남구', '북구', '광산구', '동구']},
      {city: '전주', districts: ['완산구', '덕진구']},
      {city: '여수', districts: ['여수시']},
    ],
  },
  {
    region: '제주',
    locations: [{city: '제주', districts: ['제주시', '서귀포시']}],
  },
];

// 동 데이터 맵 타입
interface DongMap {
  [key: string]: string[];
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  currentLocation = '강남구 삼성동',
  onLocationChange,
}) => {
  // 초기 위치 파싱
  const parseInitialLocation = (): {
    district: string;
    dong: string;
  } => {
    if (!currentLocation) return {district: '강남구', dong: '삼성동'};

    const parts = currentLocation.split(' ');
    if (parts.length >= 2) {
      return {
        district: parts[0],
        dong: parts[1],
      };
    }
    return {district: '강남구', dong: '삼성동'};
  };

  const initialLocation = parseInitialLocation();

  const [selectedRegion, setSelectedRegion] = useState<string>('수도권');
  const [selectedCity, setSelectedCity] = useState<string>('서울');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    initialLocation.district,
  );
  const [selectedDong, setSelectedDong] = useState<string>(
    initialLocation.dong,
  );

  // 바텀 시트 참조
  const bottomSheetRef = useRef<BottomSheet>(null);

  // 고정 스냅포인트 설정 - 화면 높이의 퍼센트로 지정
  const snapPoints = useMemo(() => ['70%'], []);

  // 바텀 시트 백드롭 설정
  const renderBackdrop = useCallback(
    (
      props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps,
    ) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  // 바텀 시트 열기
  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  // 바텀 시트 닫기
  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // 동 데이터 (예시)
  const getDongData = useCallback((district: string): string[] => {
    const dongMap: DongMap = {
      강남구: ['삼성동', '역삼동', '청담동', '논현동', '대치동'],
      서초구: ['서초동', '반포동', '방배동', '양재동', '내곡동'],
      송파구: ['잠실동', '문정동', '가락동', '석촌동', '방이동'],
      마포구: ['합정동', '상암동', '망원동', '연남동', '서교동'],
      용산구: ['이태원동', '한남동', '원효로', '서빙고동', '용문동'],
      성남시: ['분당구', '수정구', '중원구'],
      부천시: ['원미구', '소사구', '오정구'],
      수원시: ['장안구', '권선구', '팔달구', '영통구'],
      용인시: ['처인구', '기흥구', '수지구'],
      고양시: ['일산동구', '일산서구', '덕양구'],
    };

    return dongMap[district] || ['중심가'];
  }, []);

  // 위치 선택 완료
  const confirmLocation = useCallback(() => {
    const fullLocation = `${selectedDistrict} ${selectedDong}`;
    onLocationChange(fullLocation);
    closeBottomSheet();
  }, [selectedDistrict, selectedDong, onLocationChange, closeBottomSheet]);

  // 현재 선택된 도시에 해당하는 구 목록 가져오기
  const getDistricts = useMemo((): string[] => {
    const region = locationData.find(r => r.region === selectedRegion);
    if (!region) return [];

    const city = region.locations.find(c => c.city === selectedCity);
    return city?.districts || [];
  }, [selectedRegion, selectedCity]);

  // 현재 선택된 지역에 해당하는 도시 목록 가져오기
  const getCities = useMemo((): City[] => {
    const region = locationData.find(r => r.region === selectedRegion);
    return region?.locations || [];
  }, [selectedRegion]);

  return (
    <>
      {/* 현재 위치 버튼 */}
      <TouchableOpacity style={styles.locationButton} onPress={openBottomSheet}>
        <Ionicons name="location" size={20} color="#FFA135" />
        <Text style={styles.locationText}>
          {selectedDistrict} {selectedDong}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#666" />
      </TouchableOpacity>

      {/* 바텀 시트 */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.indicator}>
        <BottomSheetView style={styles.bottomSheetContent}>
          {/* 헤더 */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>지역 선택</Text>
            <TouchableOpacity onPress={closeBottomSheet}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* 지역 선택 영역 */}
          <View style={styles.locationContent}>
            {/* 지역 탭 (전국, 수도권, 부산/경상 등) */}
            <View style={styles.regionTabContainer}>
              <FlatList
                data={locationData}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.region}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={[
                      styles.regionTab,
                      selectedRegion === item.region && styles.regionTabActive,
                    ]}
                    onPress={() => {
                      setSelectedRegion(item.region);
                      if (item.locations.length > 0) {
                        const firstCity = item.locations[0].city;
                        setSelectedCity(firstCity);

                        if (item.locations[0].districts.length > 0) {
                          const firstDistrict = item.locations[0].districts[0];
                          setSelectedDistrict(firstDistrict);
                          setSelectedDong(getDongData(firstDistrict)[0]);
                        }
                      }
                    }}>
                    <Text
                      style={[
                        styles.regionTabText,
                        selectedRegion === item.region &&
                          styles.regionTabTextActive,
                      ]}>
                      {item.region}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* 도시 및 구 선택 영역 */}
            <View style={styles.selectionContainer}>
              {/* 도시 선택 */}
              <View style={styles.cityColumn}>
                <FlatList
                  data={getCities}
                  keyExtractor={item => item.city}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={[
                        styles.cityItem,
                        selectedCity === item.city && styles.selectedItem,
                      ]}
                      onPress={() => {
                        setSelectedCity(item.city);
                        if (item.districts.length > 0) {
                          const firstDistrict = item.districts[0];
                          setSelectedDistrict(firstDistrict);
                          setSelectedDong(getDongData(firstDistrict)[0]);
                        }
                      }}>
                      <Text
                        style={[
                          styles.cityItemText,
                          selectedCity === item.city && styles.selectedItemText,
                        ]}>
                        {item.city}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>

              {/* 구 선택 */}
              <View style={styles.districtColumn}>
                <FlatList
                  data={getDistricts}
                  keyExtractor={item => item}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={[
                        styles.districtItem,
                        selectedDistrict === item && styles.selectedItem,
                      ]}
                      onPress={() => {
                        setSelectedDistrict(item);
                        const dongList = getDongData(item);
                        if (dongList.length > 0) {
                          setSelectedDong(dongList[0]);
                        }
                      }}>
                      <Text
                        style={[
                          styles.districtItemText,
                          selectedDistrict === item && styles.selectedItemText,
                        ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>

              {/* 동 선택 */}
              <View style={styles.dongColumn}>
                <FlatList
                  data={getDongData(selectedDistrict)}
                  keyExtractor={item => item}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={[
                        styles.dongItem,
                        selectedDong === item && styles.selectedItem,
                      ]}
                      onPress={() => setSelectedDong(item)}>
                      <Text
                        style={[
                          styles.dongItemText,
                          selectedDong === item && styles.selectedItemText,
                        ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </View>

          {/* 확인 버튼 */}
          <SafeAreaView edges={['bottom']}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={confirmLocation}>
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 4,
    color: '#333',
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    alignSelf: 'center',
    marginTop: 8,
  },
  bottomSheetContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: height * 0.7,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  locationContent: {
    flex: 1,
    flexDirection: 'row',
  },
  regionTabContainer: {
    width: '28%',
    backgroundColor: '#F8F8F8',
    paddingVertical: 10,
  },
  regionTab: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  regionTabActive: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 3,
    borderLeftColor: '#FFA135',
  },
  regionTabText: {
    fontSize: 15,
    color: '#666',
  },
  regionTabTextActive: {
    fontWeight: '700',
    color: '#333',
  },
  selectionContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  cityColumn: {
    width: '24%',
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
  },
  districtColumn: {
    width: '24%',
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
  },
  dongColumn: {
    flex: 1,
  },
  cityItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  cityItemText: {
    fontSize: 14,
    color: '#666',
  },
  districtItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  districtItemText: {
    fontSize: 14,
    color: '#666',
  },
  dongItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  dongItemText: {
    fontSize: 14,
    color: '#666',
  },
  selectedItem: {
    backgroundColor: '#FFF5E6',
  },
  selectedItemText: {
    color: '#FFA135',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#FFA135',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LocationSelector;
