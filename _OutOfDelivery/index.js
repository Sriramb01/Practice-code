import {
  ScrollView,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import * as GlobalFunctions from '../../../Global/Functions';
import * as Globalstyles from '../../../Global/styles';
import * as GlobalAppInfo from '../../../Global/AppInfo';
import emtyCart from '../../../Assets/stay.png';
import ScreenNames from '../../../Global/ScreenNames';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { parse, differenceInSeconds } from 'date-fns';

const OutOfDelivery = ({ navigation, changeTab }) => {
  const [orders, setOrders] = useState(require('../_OutOfDelivery/outfordeliverydata.json').order);
  const [loading, setLoading] = useState({ loading: false, index: null });
  const [showBranchName, setShowBranchName] = useState(false)
  const [name, setName] = useState(null);
  // const [date, setDate] = useState(new date())

  const getData = () => {
    AsyncStorage.getItem('adminBranch').then(Storagebranch => {
      GlobalFunctions.postData(
        `${GlobalAppInfo.App.apiPath}admin_order.php?id=3&branch=${Storagebranch}`,
      ).then(object => {
       
        setOrders(object.order);
        setShowBranchName(Storagebranch == 'all')
      });
    });
  };
  const delivered = id => {
    const API = `${GlobalAppInfo.App.apiPath}admin_change_order_status.php?id=${id}&&status=delivery`;
    GlobalFunctions.postData(API).then((res) => {

      getData();
      setLoading({ loading: false, index: null });
    });
  };
  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      setOrders(prevOrders => prevOrders.map(order => {
        const currentTime = new Date();
        const orderTime = parse(order.order_placed_date, 'dd-MM-yyyy HH:mm', new Date());
        const elapsedTime = differenceInSeconds(currentTime, orderTime);
        const orderPlacedDate = order.order_placed_date;
        const selfPickupTime = order.selfpickuptime; 0
        // Parse the orderPlacedDate and selfPickupTime
        const orderTime2 = parse(orderPlacedDate, 'dd-MM-yyyy HH:mm', new Date());
        const pickupTime = parse(selfPickupTime, 'dd-MM-yyyy hh:mm a', new Date());
        // Calculate the elapsedTime2 in seconds
        const elapsedTime2 = differenceInSeconds(pickupTime, orderTime2);

       
        return {
          ...order,
          elapsedTime,
          elapsedTime2
         
        };
      }));
    }, 1000);

    return () => clearInterval(interval);

  }, []);


  const date = moment().format('DD-MM-YYYY');
  // const userName = AsyncStorage.getItem('username');

  const OutOfDeliveryView = () => {
    return orders.length > 0 ? (
      <ScrollView>
        {orders.map((order, index) => ((date) == (order.order_placed_date.split(' ')[0]) || ((date) == (order.selfpickuptime.split(' ')[0]) && (date) != (order.order_placed_date.split(' ')[0])))  &&  (

          <TouchableOpacity
            key={index}
            style={[
              style.eachCointainer,
              {
                borderColor:
                  order.total_price == 0
                    ? Globalstyles.color.oppositeColor
                    : Globalstyles.color.UIColor,
                flexDirection: 'column',
              },
            ]}
            onPress={() => {
              navigation.navigate(ScreenNames.OrderDetails, {
                orderId: order.id,
                changeTab
              });



            }}>
            <View
              style={{
                flex: 0.9,
              }}>
                 <View style={{
                    alignItems: 'flex-end',

                  }}>
                     <TouchableOpacity style={{  backgroundColor: '#ff931e', padding: 5, borderRadius: 10, elevation:5, height:30, alignItems:'center', justifyContent:'center'}}>
                        <Text style={[style.timerText, style.blueText]}>
                          {Math.floor(order.elapsedTime / 60) >= 60
                            ? `${Math.floor(order.elapsedTime / 3600)} hrs ago`
                            : `${Math.floor(order.elapsedTime / 60)} min ago`}
                        </Text>
                      </TouchableOpacity>
                    </View>
              {order.total_price == 0 && <Text style={{ color: Globalstyles.color.UIColor, textAlign: 'center', padding: 5, fontSize: 15, fontWeight: 'bold' }}>ENTERPRISE CUSTOMER</Text>}
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text style={style.textApp}>Order Number</Text>
                <Text style={style.textDot}>:</Text>
                <Text style={style.textApi}>{order.id}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text style={style.textApp}>Delivery Time</Text>
                <Text style={style.textDot}>:</Text>
                {order.address == '00' || order.address == '0'
                      ? (
                        <Text style={Number(order.elapsedTime2) > 900 ? style.textApiWarning : style.textApi}>{order.selfpickuptime}
                        </Text>
                      ) : (
                        <Text style={Number(order.elapsedTime2) > 3600 ? style.textApiWarning : style.textApi}>{order.selfpickuptime}
                        </Text>
                      )
                    }
              </View>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text style={style.textApp}>Total</Text>
                <Text style={style.textDot}>:</Text>
                <Text style={style.textApi}>
                  {`\u20b9 `}
                  {order.total_price}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text style={style.textApp}>PAYMENT</Text>
                <Text style={style.textDot}>:</Text>
                <Text style={style.textApi}>  {order.pay_id == 'Cash On Delivery'
                        ? 'Cash On Delivery'
                        : 'Online Payment'}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text style={style.textApp}>Delivery Type</Text>
                <Text style={style.textDot}>:</Text>
                <Text style={style.textApi}>
                  {(order.address == '00' || order.address == '0') ? 'Self Pickup' : 'Home Delivery'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text style={style.textApp}>Placed Time</Text>
                <Text style={style.textDot}>:</Text>
                <Text style={style.textApi}>{order.order_placed_date}</Text>
              </View>
              {showBranchName && <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text style={style.textApp}>Branch Name</Text>
                <Text style={style.textDot}>:</Text>
                <Text style={style.textApi}>{order.branchname}</Text>
              </View>}
              {(order.address != "00" || order.address != "0") &&
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Text style={style.textApp}>Delivery Boy</Text>
                  <Text style={style.textDot}>:</Text>
                  <Text style={style.textApi}>{order.deliveryboyname}</Text>
                </View>
              }
              {(order.future_order == "1") &&
                <View
                  style={{justifyContent: 'center',
                  alignItems: 'center',
                  height: '10%',}}>
                  <Text style={[
                            style.textApp,
                            {
                              borderWidth: 2,
                              borderColor: Globalstyles.color.oppositeColor,
                              borderRadius: 5,
                              textAlign: 'center',
                              backgroundColor: '#ffef00',
                              height: '70%',
                              padding:1
                            },
                          ]}>FUTURE ORDER</Text>
                </View>
              }
            </View>
            <View
              style={{
                flex: 0.1,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (order.a_id == '00' || order.a_id == '0') {
                    setLoading({ loading: true, index: index });
                    delivered(order.id);
                  } else {
                    navigation.navigate(ScreenNames.AssignOrder, {
                      orderid: order.id,
                      type: 'REASSIGN'.toLocaleLowerCase(),
                      navigation: navigation,
                      changeTab
                    });
                  }
                }}
                style={style.acptRejectButton}>
                <Text style={style.assignOrder}>
                  {loading.loading && loading.index == index ? (
                    <ActivityIndicator
                      size={'small'}
                      color={Globalstyles.color.black}
                      style={{
                        alignItems: 'center',
                      }}
                    />
                  ) : (order.a_id == '00' || order.a_id == '0') ? (
                    ' DELIVERY '
                  ) : (
                    ' REASSIGN '
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    ) : (
      <View style={style.exptyCartView}>
        <Image source={emtyCart} style={{ width: 300, height: 300 }} />
      </View>
    );
  };
  return (
    <>
      {orders == null ? (
        <ActivityIndicator
          size={60}
          color={Globalstyles.color.UIColor}
          style={{
            alignItems: 'center',
            paddingTop: '50%',
          }}
        />
      ) : (
        <OutOfDeliveryView />
      )}
    </>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    width: Globalstyles.windowWidthPercentage(100),
  },
  eachCointainer: {
    width: Globalstyles.windowWidthPercentage(98),
    height: 'auto',
    margin: Globalstyles.windowWidthPercentage(1),
    padding: 5,
    borderWidth: 2,
    borderRadius: 5,
    flexDirection: 'row',
  },
  eachCointainerText: {
    fontSize: 13,
    color: Globalstyles.color.black,
    fontFamily: GlobalAppInfo.App.font,
  },
  exptyCartView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '30%',
  },
  acptRejectButton: {
    padding: 10,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: Globalstyles.color.accept,
  },
  assignOrder: {
    fontFamily: GlobalAppInfo.App.font,
    color: Globalstyles.color.black,
    fontSize: 11,
  },
  textApp: {
    flex: 1,
    fontFamily: GlobalAppInfo.App.font,
    fontSize: 12,
    color: Globalstyles.color.black,
  },
  textDot: {
    flex: 0.5,
    textAlign: 'center',
    color: Globalstyles.color.black,
  },
  textApi: {
    flex: 1,
    fontFamily: GlobalAppInfo.App.font,
    fontSize: 12,
    color: Globalstyles.color.blackLigh,
  },
  blueText: {
    color: 'white',
    fontFamily: GlobalAppInfo.App.font,
    fontSize: 12,
  },
  textApiWarning: {
    flex: 1,
    fontFamily: GlobalAppInfo.App.font,
    fontSize: 12,
    color: Globalstyles.color.UIColor,
  },
  
});
export default OutOfDelivery;
