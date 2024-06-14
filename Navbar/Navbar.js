import React, {useState, useEffect} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native';
import NavbarItems from './NavbarItems';
import * as GlobalAppInfo from '../../../Global/AppInfo';
import * as Globalstyles from '../../../Global/styles';
import * as GlobalFunctions from '../../../Global/Functions';
import Canceled from '../_Canceled';
import Complete from '../_Complete';
import NewOrder from '../_NewOrder';
import OutOfDelivery from '../_OutOfDelivery';
import Preparing from '../_Preparing';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Navbar = ({natifications, navigation}) => {
  const [selectedId, setSelectedId] = useState(1);
  const [ordercount, setOrderCount] = useState([])


  function OrderCount () {
    AsyncStorage.getItem('adminBranch').then(Storagebranch => {
    const API = `${GlobalAppInfo.App.apiPath}admin_order_count.php?branch=${Storagebranch}`;
    GlobalFunctions.postData(API).then(res => {
        setOrderCount(res)
    })
  })
  }
  useEffect(() => {
    OrderCount()
    messaging().onMessage(async remoteMessage => OrderCount());
  }, []);


  useEffect(() => {
    OrderCount()
  }, [selectedId]);

  const DisplayItem = () => {
    return (
      <ScrollView
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{height: Globalstyles.windowHeightPercentage(10)}}>
        {NavbarItems.map((item, index) => {
          return (
            <View
              key={index}
              style={{alignItems: 'flex-end', position: 'relative'}}>
               
              <TouchableOpacity
                onPress={() => {
                  setSelectedId(item.id);
                }}
                style={[
                  styles.item,
                  {
                    backgroundColor:
                      item.id === selectedId
                        ? Globalstyles.color.UIColor
                        : Globalstyles.color.white,
                    width: 'auto',
                  },
                ]}>
                <Image
                  source={item.img}
                  style={{
                    width: 22,
                    height: 22,
                    marginHorizontal: Globalstyles.windowWidthPercentage(1),
                  }}
                />
                {item.id == selectedId && (
                  <Text style={[styles.title]}>{item.title}</Text>
                )}
                <View style={{flex:1, justifyContent:'center', backgroundColor:Globalstyles.color.reject, width:25, height: 25, borderRadius:15}}>
                <Text style={{textAlign:'center',color:Globalstyles.color.white, fontWeight:'bold'}}>{ordercount[item.name]}</Text>
                </View>
          
                {/* Notification doct */}
              </TouchableOpacity>
              {item.id !== selectedId && index == 0 && natifications > 0 && (
                <Text
                  style={{
                    width: 15,
                    height: 15,
                    backgroundColor: Globalstyles.color.red,
                    borderRadius: 50,
                    marginBottom: -25,
                    textAlign: 'center',
                    justifyContent: 'center',
                    color: Globalstyles.color.white,
                    position: 'absolute',
                  }}>
                  {natifications}
                </Text>
              )}
              
            </View>
          );
        })}
      </ScrollView>
    );
  };
  return (
    <View>
      <DisplayItem />
      {selectedId == 1 ? (
        <NewOrder
          changeTab={setSelectedId}
          page={selectedId}
          navigation={navigation}
        />
      ) : selectedId == 2 ? (
        <Preparing
          changeTab={setSelectedId}
          page={selectedId}
          navigation={navigation}
        />
      ) : selectedId == 3 ? (
        <OutOfDelivery
          changeTab={setSelectedId}
          page={selectedId}
          navigation={navigation}
        />
      ) : selectedId == 4 ? (
        <Complete
          changeTab={setSelectedId}
          page={selectedId}
          navigation={navigation}
        />
      ) : (
        selectedId == 5 && (
          <Canceled
            changeTab={setSelectedId}
            page={selectedId}
            navigation={navigation}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginVertical: 8,
    marginLeft: Globalstyles.windowWidthPercentage(2.5),
    borderRadius: 50,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 12,
    color: 'white',
    fontFamily: GlobalAppInfo.App.font
  },
});

export default Navbar;
