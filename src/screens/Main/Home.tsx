import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LocationSelector from '../../components/LocationSelector';

const {width} = Dimensions.get('window');

// 배너 데이터
const bannerData = [
  {
    id: '1',
    image: require('../../../public/images/placeholder.png'),
    title: '여름 시즌 특별 할인',
  },
  {
    id: '2',
    image: require('../../../public/images/placeholder.png'),
    title: '신규 오픈 카페 소개',
  },
  {
    id: '3',
    image: require('../../../public/images/placeholder.png'),
    title: '아이스 음료 프로모션',
  },
];

// 특가 카페 데이터
const specialCafes = [
  {
    id: '1',
    name: '블루보틀 코리아',
    image: require('../../../public/images/placeholder.png'),
    discount: '15%',
    rating: 4.8,
    distance: '1.2km',
  },
  {
    id: '2',
    name: '스타벅스 강남점',
    image: require('../../../public/images/placeholder.png'),
    discount: '10%',
    rating: 4.5,
    distance: '0.8km',
  },
  {
    id: '3',
    name: '커피빈 신논현',
    image: require('../../../public/images/placeholder.png'),
    discount: '20%',
    rating: 4.6,
    distance: '1.5km',
  },
  {
    id: '4',
    name: '폴 바셋 역삼',
    image: require('../../../public/images/placeholder.png'),
    discount: '25%',
    rating: 4.7,
    distance: '0.5km',
  },
  {
    id: '5',
    name: '투썸플레이스',
    image: require('../../../public/images/placeholder.png'),
    discount: '15%',
    rating: 4.4,
    distance: '2.0km',
  },
  {
    id: '6',
    name: '카페 드 코르테',
    image: require('../../../public/images/placeholder.png'),
    discount: '30%',
    rating: 4.9,
    distance: '1.7km',
  },
];

// 추천 메뉴 데이터
const recommendedMenus = [
  {
    id: '1',
    name: '아이스 아메리카노',
    image: require('../../../public/images/placeholder.png'),
    price: '4,500원',
    cafeName: '스타벅스',
  },
  {
    id: '2',
    name: '카페 라떼',
    image: require('../../../public/images/placeholder.png'),
    price: '5,000원',
    cafeName: '블루보틀',
  },
  {
    id: '3',
    name: '바닐라 콜드브루',
    image: require('../../../public/images/placeholder.png'),
    price: '5,800원',
    cafeName: '커피빈',
  },
  {
    id: '4',
    name: '카라멜 마끼아또',
    image: require('../../../public/images/placeholder.png'),
    price: '6,000원',
    cafeName: '폴 바셋',
  },
];

const Home = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentLocation, setCurrentLocation] = useState('강남구 삼성동');
  const bannerRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentBannerIndex + 1) % bannerData.length;
      setCurrentBannerIndex(nextIndex);

      bannerRef.current?.scrollTo({
        x: width * nextIndex,
        animated: true,
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [currentBannerIndex]);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentBannerIndex(index);
  };

  const handleLocationChange = (location: string) => {
    setCurrentLocation(location);
  };

  const renderCafeItem = ({item, index}: {item: any; index: number}) => (
    <TouchableOpacity style={styles.cafeCard}>
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>{item.discount}</Text>
      </View>
      <Image source={item.image} style={styles.cafeImage} />
      <View style={styles.cafeInfo}>
        <Text style={styles.cafeName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.cafeDetailRow}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFA135" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <View style={styles.distanceContainer}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.distanceText}>{item.distance}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMenuItem = ({item}: {item: any}) => (
    <TouchableOpacity style={styles.menuItem}>
      <Image source={item.image} style={styles.menuImage} />
      <Text style={styles.menuName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.menuPrice}>{item.price}</Text>
      <Text style={styles.menuCafe}>{item.cafeName}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#FFFFFF'}}
      edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.header}>
          <LocationSelector
            currentLocation={currentLocation}
            onLocationChange={handleLocationChange}
          />
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={22} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="cart-outline" size={22} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <View style={styles.bannerContainer}>
            <ScrollView
              ref={bannerRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScroll}>
              {bannerData.map(banner => (
                <View key={banner.id} style={styles.bannerSlide}>
                  <Image source={banner.image} style={styles.bannerImage} />
                </View>
              ))}
            </ScrollView>
            <View style={styles.pagination}>
              {bannerData.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    currentBannerIndex === index && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>오늘의 특가 카페</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>전체보기</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={specialCafes}
              renderItem={renderCafeItem}
              keyExtractor={item => item.id}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.cafeRow}
              style={styles.cafeGrid}
            />
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>인기 메뉴</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>전체보기</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={recommendedMenus}
              renderItem={renderMenuItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.menuList}
              contentContainerStyle={styles.menuListContent}
            />
          </View>
          <TouchableOpacity style={styles.eventBanner}>
            <Image
              source={require('../../../public/images/placeholder.png')}
              style={styles.eventBannerImage}
            />
            <View style={styles.eventBannerTextContainer}>
              <Text style={styles.eventBannerText}>
                친구 추천하고 5,000원 적립금 받기
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 4,
    color: '#333',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  bannerContainer: {
    height: 200,
    position: 'relative',
  },
  bannerSlide: {
    width,
    height: 200,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerTextContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 12,
  },
  sectionContainer: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#666',
  },
  cafeGrid: {
    width: '100%',
  },
  cafeRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cafeCard: {
    width: (width - 40) / 2,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e9e9e9',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFA135',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cafeImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  cafeInfo: {
    padding: 10,
  },
  cafeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  cafeDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 2,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  menuList: {
    marginTop: 4,
  },
  menuListContent: {
    paddingRight: 16,
  },
  menuItem: {
    width: 140,
    marginRight: 12,
  },
  menuImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
  },
  menuName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 6,
  },
  menuPrice: {
    fontSize: 13,
    color: '#FFA135',
    fontWeight: '700',
    marginTop: 2,
  },
  menuCafe: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  eventBanner: {
    marginTop: 24,
    marginHorizontal: 16,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventBannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  eventBannerTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  eventBannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
});

export default Home;
