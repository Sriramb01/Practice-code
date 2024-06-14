import {
  ScrollView,
  Text,
  ActivityIndicator,
  View,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import * as GlobalFunctions from '../../../Global/Functions';
import * as Globalstyles from '../../../Global/styles';
import * as GlobalAppInfo from '../../../Global/AppInfo';
import emtyCart from '../../../Assets/stay.png';
import ScreenNames from '../../../Global/ScreenNames';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import moment from 'moment';
import { parse, differenceInSeconds } from 'date-fns';

import { color, log } from 'react-native-reanimated';
import { Button } from 'react-native-paper';
const Stack = createNativeStackNavigator();
const NewOrder = ({ navigation, changeTab }) => {
  const [orders, setOrders] = useState([]);
  const [orders1, setOrders1] = useState([]);
  const [showBranchName, setShowBranchName] = useState(false);
  const [seconds, setSeconds] = useState(1);
  const [isMoreThanOneHour, setIsMoreThanOneHour] = useState(false);
  const [acceptRejectLoading, setAcceptRejectLoading] = useState({
    accept: false,
    reject: false,
    id: null,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => prevOrders.map(order => ({
        ...order,
        elapsedTime: order.elapsedTime + 1,
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      setOrders(prevOrders => prevOrders.map(order => {
        const currentTime = new Date();
        const orderTime = parse(order.order_placed_date, 'dd-MM-yyyy HH:mm', new Date());
        const elapsedTime = differenceInSeconds(currentTime, orderTime);
        AsyncStorage.setItem("2222", elapsedTime.toString());

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




  // const getData =async () => {
  //   console.log("22222");
  //  await AsyncStorage.getItem('adminBranch').then(Storagebranch => {
  //     GlobalFunctions.postData(
  //       `${GlobalAppInfo.App.apiPath}admin_order.php?id=1&branch=${Storagebranch}`,
  //     )
  //       .then(async (object) => {
  //         const currentTime = new Date();
  //         const updatedOrders = await Promise.all(object.order.map(async order => {
  //           const orderTime = parse(order.order_placed_date, 'dd-MM-yyyy HH:mm', new Date());
  //           order.elapsedTime = differenceInSeconds(currentTime, orderTime);
  //           const formattedTime = Math.floor(order.elapsedTime / 60) >= 60
  //             ? `${Math.floor(order.elapsedTime / 3600)} hrs ago`
  //             : `${Math.floor(order.elapsedTime / 60)} min ago`;
  //           await AsyncStorage.setItem(`order_${order.id}_elapsedTime`, formattedTime);

  //           return {
  //             ...order,
  //             formattedTime,
  //           };
  //         }));
  //         setOrders(updatedOrders);
  //         setShowBranchName(Storagebranch === 'all');

  //       })
  //       .finally(() => {
  //         setAcceptRejectLoading({ reject: false, accept: false, id: null });
  //       });
  //   });
  // };



  // const handleChange = async() => {


  //   const updatedOrders = [];

  //    orders.forEach((item) => {
  //     const orderPlacedDate = item.order_placed_date;
  //     const selfPickupTime = item.selfpickuptime;
  //     console.log("3333");
  //     // Parse the orderPlacedDate and selfPickupTime
  //     const orderTime = parse(orderPlacedDate, 'dd-MM-yyyy HH:mm', new Date());
  //     const pickupTime = parse(selfPickupTime, 'dd-MM-yyyy hh:mm a', new Date());

  //     // Calculate the elapsedTime2 in seconds
  //     const elapsedTime2 = differenceInSeconds(pickupTime, orderTime);

  //     // Add the elapsedTime2 to the item object
  //     const updatedItem = { ...item, elapsedTime2 };

  //     // Push the updated item to the new array
  //     updatedOrders.push(updatedItem);

  //     // Log the updated elapsedTime2
  //     console.log(2222, updatedItem.elapsedTime2);
  //   });

  //   // Update the orders state with the modified list
  //   setOrders1(updatedOrders);
  // };

  const getData = async () => {
   
    await AsyncStorage.getItem('adminBranch').then(Storagebranch => {
      GlobalFunctions.postData(
        `${GlobalAppInfo.App.apiPath}admin_order.php?id=1&branch=${Storagebranch}`,
      )
        .then(async (object) => {
          const currentTime = new Date();
          const updatedOrders = await Promise.all(object.order.map(async order => {
            const orderTime = parse(order.order_placed_date, 'dd-MM-yyyy HH:mm', new Date());
            order.elapsedTime = differenceInSeconds(currentTime, orderTime);
            const formattedTime = Math.floor(order.elapsedTime / 60) >= 60
              ? `${Math.floor(order.elapsedTime / 3600)} hrs ago`
              : `${Math.floor(order.elapsedTime / 60)} min ago`;
            await AsyncStorage.setItem(`order_${order.id}_elapsedTime`, formattedTime);

            return {
              ...order,
              formattedTime,
            };
          }));
          setOrders(updatedOrders);
          setShowBranchName(Storagebranch === 'all');
        })
        .finally(() => {
          setAcceptRejectLoading({ reject: false, accept: false, id: null });
        });
    });
  };

  // const handleChange = async () => {


  //   const updatedOrders = [];

  //   orders.forEach((item) => {
  //     console.log("3333");
  //     const orderPlacedDate = item.order_placed_date;
  //     const selfPickupTime = item.selfpickuptime;
  //     console.log("Processing order", item.id);
  //     // Parse the orderPlacedDate and selfPickupTime
  //     const orderTime = parse(orderPlacedDate, 'dd-MM-yyyy HH:mm', new Date());
  //     const pickupTime = parse(selfPickupTime, 'dd-MM-yyyy hh:mm a', new Date());

  //     // Calculate the elapsedTime2 in seconds
  //     const elapsedTime2 = differenceInSeconds(pickupTime, orderTime);

  //     // Add the elapsedTime2 to the item object
  //     const updatedItem = { ...item, elapsedTime2 };

  //     // Push the updated item to the new array
  //     updatedOrders.push(updatedItem);

  //     // Log the updated elapsedTime2
  //     console.log(2222, updatedItem.elapsedTime2);
  //   });

  //   // Update the orders state with the modified list
  //   setOrders(updatedOrders);
  // };

  useEffect(() => {

    getData();




  }, []);
  function postAccept(id) {
    const API = `${GlobalAppInfo.App.apiPath}admin_change_order_status.php?id=${id}&&status=accept`;
    GlobalFunctions.postData(API)
      .then(() => {
        changeTab(2);
      })
      .finally(() =>
        setAcceptRejectLoading({ reject: false, accept: false, id: null }),
      );
  }
  function postReject({ id, pay_id }) {
    function makepostReject() {
      GlobalFunctions.postData(
        `${GlobalAppInfo.App.apiPath}razor_pay_refund_payment.php?order_id_admin=${id}&&payment_id_rapivalue=${pay_id}`,
      ).then(result => {
        if (result.includes('rfnd_')) {
          GlobalFunctions.postData(
            `${GlobalAppInfo.App.apiPath}admin_change_order_status.php?id=${id}&&status=rejectonline`,
          )
            .then(res => null)
            .finally(() => {
              changeTab(5);
            });
        } else if (result.includes('cod_reject_admin')) {
          GlobalFunctions.postData(
            `${GlobalAppInfo.App.apiPath}admin_change_order_status.php?id=${id}&&status=rejectcash`,
          )
            .then(res => null)
            .finally(() => {
              changeTab(5);
            });
        }
      });
    }
    Alert.alert('Reject', `MAKE SURE YOU REJECT ORDER NUMBER ${id}`, [
      {
        text: 'NO',
        onPress: () => {
          setAcceptRejectLoading({ reject: false, accept: false, id: null });
        },
      },
      {
        text: 'YES',
        onPress: () => makepostReject(),
      },
    ]);
  }

  const date = moment().format('DD-MM-YYYY');

  // useEffect(() => {

  //   const fetchdet=async()=>{
  //    await getData();
  //    await handleChange();
  //   }

  //  fetchdet();
  // }, []);


  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [seconds]);

  useEffect(() => {
    messaging().onMessage(async remoteMessage => getData());
  }, []);

  const NewOrder = () => {

    return orders.length > 0 ? (
      <ScrollView>
        {orders.map(

          (order, index) =>

            (date == order.order_placed_date.split(' ')[0] ||
              (date == order.selfpickuptime.split(' ')[0] &&
                date != order.order_placed_date.split(' ')[0])) && (
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
                  });
                  //console.log()
                }}>
                <View
                  style={{
                    flex: 0.8,
                  }}>
                  {order.total_price == 0 && (
                    <Text
                      style={{
                        color: Globalstyles.color.UIColor,
                        textAlign: 'center',
                        padding: 5,
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      ENTERPRISE CUSTOMER
                    </Text>
                  )}
                  <View style={{
                                       alignItems: 'flex-end',
                  }}>
                    

                    {/* <Text style={style.timerText}>{Math.floor( order.elapsedTime/60) >=60 ? {Math.floor( order.elapsedTime/60*60)} hrs ago: {Math.floor( order.elapsedTime/60)} min ago }</Text> */}
                    <View>
                      <TouchableOpacity style={{  backgroundColor: '#ff931e', padding: 5, borderRadius: 10, elevation:5, height:30, alignItems:'center', justifyContent:'center'}}>
                        <Text style={[style.timerText, style.blueText]}>
                          {Math.floor(order.elapsedTime / 60) >= 60
                            ? `${Math.floor(order.elapsedTime / 3600)} hrs ago`
                            : `${Math.floor(order.elapsedTime / 60)} min ago`}
                        </Text>
                      </TouchableOpacity>
                    </View>



                  </View>

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
                    <Text style={style.textApi}>
                      {order.pay_id == 'Cash On Delivery'
                        ? 'Cash On Delivery'
                        : 'Online Payment'}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Text style={style.textApp}>Delivery Type</Text>
                    <Text style={style.textDot}>:</Text>
                    <Text style={style.textApi}>
                      {order.address == '00' || order.address == '0'
                        ? 'Self Pickup'
                        : 'Home Delivery'}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Text style={style.textApp}>Placed Time</Text>
                    <Text style={style.textDot}>:</Text>
                    <Text style={style.textApi}>
                      {order.order_placed_date}
                    </Text>
                  </View>

                  {showBranchName && (
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Text style={style.textApp}>Branch Name</Text>
                      <Text style={style.textDot}>:</Text>
                      <Text style={style.textApi}>{order.branchname}</Text>
                    </View>
                  )}

                  {GlobalFunctions.compareOrder(order.selfpickuptime) &&
                    order.selfpickuptime != 'default' && (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '10%',
                        }}>
                        <Text
                          style={[
                            style.textApp,
                            {
                              borderWidth: 2,
                              borderColor: Globalstyles.color.oppositeColor,
                              borderRadius: 5,
                              textAlign: 'center',
                              backgroundColor: '#ffef00',
                              height: '70%',
                              padding: 1,
                            },
                          ]}>
                          FUTURE ORDER
                        </Text>
                      </View>
                    )}
                </View>

                <View
                  style={{
                    flex: 0.3,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}>
                  <Pressable
                    style={[
                      style.acptRejectButton,
                      { backgroundColor: Globalstyles.color.reject },
                    ]}
                    onPress={() => {
                      setAcceptRejectLoading({ reject: true, id: order.id });
                      postReject(order);
                    }}>
                    <Text style={style.acptRejectButton_Text}>
                      {acceptRejectLoading.reject &&
                        acceptRejectLoading.id == order.id ? (
                        <ActivityIndicator
                          size={18}
                          color={Globalstyles.color.black}
                          style={{
                            alignItems: 'center',
                          }}
                        />
                      ) : (
                        'REJECT'
                      )}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      style.acptRejectButton,
                      { backgroundColor: Globalstyles.color.accept },
                    ]}
                    onPress={() => {
                      setAcceptRejectLoading({ accept: true, id: order.id });
                      postAccept(order.id);
                    }}>
                    <Text style={style.acptRejectButton_Text}>
                      {acceptRejectLoading.accept &&
                        acceptRejectLoading.id == order.id ? (
                        <ActivityIndicator
                          size={18}
                          color={Globalstyles.color.black}
                          style={{
                            alignItems: 'center',
                          }}
                        />
                      ) : (
                        'ACCEPT'
                      )}
                    </Text>
                  </Pressable>
                </View>
                {/* <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '40%',
                        borderRadius: 5,
                        borderColor: Globalstyles.color.UIColor,
                        backgroundColor: Globalstyles.color.oppositeColor,
                        color: Globalstyles.color.black,
                        height: 40,
                      }}>
                      <Text
                        style={{
                          color: Globalstyles.color.white,
                          fontSize: 18,
                          fontWeight: 'bold',
                        }}>
                        00:00
                      </Text>
                    </TouchableOpacity>
                  </View> */}
              </TouchableOpacity>
            ),
        )}
      </ScrollView>
    ) : (
      <View style={style.exptyCartView}>
        <Image source={emtyCart} style={{ width: 300, height: 300 }} />
      </View>
    );
  };


  return (
    <View>
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
        <NewOrder />
      )}
    </View>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    width: Globalstyles.windowWidthPercentage(100),
  },
  eachCointainer: {
    width: Globalstyles.windowWidthPercentage(98),
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
    padding: 7,
    margin: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    borderColor: Globalstyles.color.UIColor,
    width: '40%',
  },
  acptRejectButton_Text: {
    fontSize: 13,
    fontFamily: GlobalAppInfo.App.font,
  },
  textApp: {
    flex: 0.7,
    fontFamily: GlobalAppInfo.App.font,
    fontSize: 12,
    color: Globalstyles.color.black,
  },
  textDot: {
    flex: 0.5,
    textAlign: 'center',
    color: Globalstyles.color.black,
    fontSize: 17,
  },

  textApi: {
    flex: 1,
    fontFamily: GlobalAppInfo.App.font,
    fontSize: 12,
    color: Globalstyles.color.blackLigh,
  },
  textApiWarning: {
    flex: 1,
    fontFamily: GlobalAppInfo.App.font,
    fontSize: 12,
    color: Globalstyles.color.UIColor,
  },
  blueText: {
    color: 'white',
    fontFamily: GlobalAppInfo.App.font,
    fontSize: 12,
  },
});
export default NewOrder;
