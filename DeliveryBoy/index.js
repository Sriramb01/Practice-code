import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import * as GlobalAppInfo from '../../Global/AppInfo';
import * as Globalstyles from '../../Global/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { postData } from '../../Global/Functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Headder from '../Headder/Headder';
import LoadingActivityIndicator from '../LoadingActivityIndicator';
import { style } from '../Headder/styles';
import { Picker } from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import { RadioButton } from 'react-native-paper';
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
const DeliveryBoy = ({ navigation }) => {
  const [data, setData] = useState([]);
 
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [addDeliveryBoyModal, setAddDeliveryBoyModal] = useState(false);
  const [dboyManName, setdboyManName] = useState('');
  const [dboyManNumber, setDboyManNumber] = useState('');
  const [dboyManEmail, setDboyManEmail] = useState('');
  const [dboyManPass, setDboyManPass] = useState('');
  const [dboyManVehicleNo, setDboyManVehicleNo] = useState('');
  const [dboyManVehicleType, setDboyManVehicleType] = useState('');
  const [dboyManBranch, setDboyManBranch] = useState('');
  const [dboyIdEdit, setDboyIdEdit] = useState(null);
  const [loadingDeliveryBoyId, setLoadingDeliveryBoyId] = useState(null);
  const [loadingEditBoyID, setLoadingEditBoyID] = useState(null);
  const [dboyEdit, setDboyEdit] = useState(true);
  const [loadingDboyApi, setLoadingDboyApi] = useState(false);
  const [branchModal, setBranchModal] = useState(false);
  const [apiBranch, setApiBranch] = useState([]);
  const [dboyManId, setDboyManId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const DeliveryBoyList = async () => {
    setLoading(true);
    let Branch = await AsyncStorage.getItem('adminBranch', null, res => null);
    const API = `${GlobalAppInfo.App.apiPath}admin_deliveryboy.php?bid=${Branch}`;
    postData(API).then(res => {
      setData(res);
      setFilteredProducts(res.deliveryboy || []);
      setLoading(false);
    });
    return null;
  };
  const getBranch = () => {
    const API = `${GlobalAppInfo.App.apiPath}admin_delboy_branch.php`;
    postData(API).then((res) => {
      setApiBranch(res);
    })

  }
  const deleteDeliveryBoy = ({ uid }) => {
    setLoadingDeliveryBoyId(uid);
    const API = `${GlobalAppInfo.App.apiPath}deliver_boy_admin.php?del_id=${uid}`;
    postData(API).then(res => {
      setLoadingDeliveryBoyId(null);
      DeliveryBoyList();
    });
  };
  const handleEditDeliveryBoy = ({ item, isDone = false }) => {
    if (isDone) {
      setLoadingDboyApi(true);
      if (
        dboyManName != '' &&
        dboyManNumber != '' &&
        dboyManPass != '' &&
        dboyManVehicleNo != '' &&
        dboyManVehicleType != '' &&
        dboyManEmail != ''
      ) {
        const API = `${GlobalAppInfo.App.apiPath}deliver_boy_admin.php?uid=${dboyIdEdit}&uemail=${dboyManEmail}&ucontactno=${dboyManNumber}&uname=${dboyManName}&upassword=${dboyManPass}&uvehicleno=${dboyManVehicleNo}&uvehicletype=${dboyManVehicleType}`;

        postData(API).then(res => {
          setLoadingDeliveryBoyId(null);
          setLoadingDboyApi(false);
          DeliveryBoyList();
          handleAddDeliveryModalClose();
        });
      } else {
        Alert.alert('Error', 'Please Fill All the Details');
      }
    } else {
      setAddDeliveryBoyModal(null);
      setDboyEdit(true);
      setdboyManName(item.name);
      setDboyIdEdit(item.id);
      setDboyManEmail(item.email);
      setDboyManNumber(item.mobile_no);
      setDboyManPass(item.password);
      setDboyManVehicleNo(item.vehicle_no);
      setDboyManVehicleType(item.vehicle_type);
      setLoadingEditBoyID(item.id);
      setAddDeliveryBoyModal(true);
    }
  };
  const handleAddDeliveryBoy = () => {
   
    if (
      dboyManName != '' &&
      dboyManNumber != '' &&
      dboyManPass != '' &&
      dboyManVehicleNo != '' &&
      dboyManVehicleType != '' &&
      dboyManEmail != ''
    ) {
      setLoadingDboyApi(true);
      const API = `${GlobalAppInfo.App.apiPath}deliver_boy_admin.php?add=true&name=${dboyManName}&contactno=${dboyManNumber}&password=${dboyManPass}&vehicleno=${dboyManVehicleNo}&vehicletype=${dboyManVehicleType}&email=${dboyManEmail}&branchid=${dboyManId}&branchid=${dboyManId}`; postData(API).then(res => {
    
        setLoadingDeliveryBoyId(null);
        DeliveryBoyList();
        setLoadingDboyApi(false);
        handleAddDeliveryModalClose();
      });
    } else {
      Alert.alert('Error', 'Please Fill All the Details');
    }
  };
  const handleAddDeliveryModalClose = () => {
    setdboyManName('');
    setDboyManNumber('');
    setDboyManEmail('');
    setDboyManPass('');
    setDboyManVehicleNo('');
    setDboyManVehicleType('');
    setAddDeliveryBoyModal(false);
    setLoadingEditBoyID(null);
  };


  useEffect(() => {
    AsyncStorage.getItem('adminBranch').then(branch =>
      setIsAdmin(branch == 'all'),
    );
    DeliveryBoyList();
    getBranch();
  }, []);
  // Filter products based on search query
  useEffect(() => {
    if (data && data.deliveryboy) { // Check if data and data.deliveryboy are defined
      const filtered = data.deliveryboy.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, data]);
  return (

    <View style={{ flex: 1 }}>
      <Headder navigation={navigation} />
      {loading ? (
        <LoadingActivityIndicator />
      ) : (

        <View style={{ flex: 1 }}>
          {isAdmin && (
            <View>
              <TouchableOpacity
                onPress={() => {
                  setAddDeliveryBoyModal(true);
                  setDboyEdit(false);
                }}
                style={{
                  marginVertical: 5,
                  paddingVertical: 5,
                  marginHorizontal: 10,
                  paddingHorizontal: 10,
                  backgroundColor: Globalstyles.color.white,
                  borderColor: Globalstyles.color.UIColor,
                  borderWidth: 1,
                  borderRadius: 10,
                  width: '80%',
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: GlobalAppInfo.App.font,
                    color: Globalstyles.color.black,
                    fontSize: 13,
                    margin: 3,
                  }}>
                  ADD DELIVERY BOY
                </Text>

              </TouchableOpacity>
            <View style={{marginHorizontal:50}}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search by name"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            </View>
          )}
          {filteredProducts && filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts}
              keyExtractor={item => item.id}
              style={{ height: 'auto' }}
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={{
                      marginVertical: 5,
                      paddingVertical: 5,
                      marginHorizontal: 10,
                      paddingHorizontal: 10,
                      backgroundColor: Globalstyles.color.white,
                      borderColor: Globalstyles.color.UIColor,
                      borderWidth: 1,
                      borderRadius: 10,
                    }}>
                    <View>
                      <Text
                        style={{
                          color: Globalstyles.color.black,
                          fontSize: 13,
                          margin: 3,
                          fontFamily: GlobalAppInfo.App.font,
                        }}>
                        {' '}
                        Name : {item.name}
                      </Text>
                      <Text
                        style={{
                          color: Globalstyles.color.blackLigh,
                          margin: 3,
                          fontSize: 12,
                          fontFamily: GlobalAppInfo.App.font,
                        }}>
                        Branch : {item.branch_name}
                      </Text>
                      <Text
                        style={{
                          color: Globalstyles.color.blackLigh,
                          margin: 3,
                          fontSize: 12,
                          fontFamily: GlobalAppInfo.App.font,
                        }}>
                        Mobile: {item.mobile_no}
                      </Text>
                      <Text
                        style={{
                          color: Globalstyles.color.blackLigh,
                          margin: 3,
                          fontSize: 12,
                          fontFamily: GlobalAppInfo.App.font,
                        }}>
                        Email: {item.email}
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'space-evenly',
                        flexDirection: 'row',
                        margin: 5,
                      }}>
                      <Text
                        style={{
                          backgroundColor:
                            item.presence == 'Available'
                              ? Globalstyles.color.accept
                              : Globalstyles.color.reject,
                          borderRadius: 5,
                          padding: 5,
                          textAlign: 'center',
                          color: Globalstyles.color.white,
                          fontSize: 15,
                          fontFamily: GlobalAppInfo.App.font,
                          fontWeight: 'bold',
                        }}>
                        {item.presence}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            'Alert',
                            `Did You want to delete Delivery boy ${item.name}`,
                            [
                              {
                                text: 'Cancel',
                                onPress: () => null,
                              },
                              {
                                text: 'OK',
                                onPress: () =>
                                  deleteDeliveryBoy({ uid: item.id }),
                              },
                            ],
                          );
                        }}
                        style={{
                          backgroundColor: Globalstyles.color.reject,
                          borderRadius: 5,
                          padding: 5,
                          color: Globalstyles.color.white,
                          fontSize: 15,
                          fontFamily: GlobalAppInfo.App.font,
                          justifyContent: 'center',
                        }}>
                        {loadingDeliveryBoyId == item.id ? (
                          <ActivityIndicator
                            size={20}
                            color={Globalstyles.color.white}
                          />
                        ) : (
                          <MaterialIcons
                            name="delete"
                            size={20}
                            color={Globalstyles.color.white}
                          />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleEditDeliveryBoy({ item })}
                        style={{
                          backgroundColor: Globalstyles.color.reject,
                          borderRadius: 5,
                          padding: 5,
                          color: Globalstyles.color.white,
                          fontSize: 15,
                          fontFamily: GlobalAppInfo.App.font,
                          justifyContent: 'center',
                        }}>
                        {loadingEditBoyID == item.id ? (
                          <ActivityIndicator
                            size={20}
                            color={Globalstyles.color.white}
                          />
                        ) : (
                          <MaterialIcons
                            name="edit"
                            size={20}
                            color={Globalstyles.color.white}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          ) : (
            <View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text
                style={{
                  color: Globalstyles.color.UIColor,
                  fontFamily: Globalstyles.fontFamily.GoogleBold,
                  elevation: 10,
                }}>
                No Delivery Boy Availale
              </Text>
            </View>
          )}
        </View>
      )}
      <Modal
        animationType="none"
        transparent={true}
        visible={addDeliveryBoyModal}
        onRequestClose={() => {
          setAddDeliveryBoyModal(false);
          handleAddDeliveryModalClose();
        }}>
        <View
          style={{
            flex: 1,
          }}>
          <ScrollView
            style={{
              backgroundColor: Globalstyles.color.white,
              padding: 10,
              flex: 1,
            }}>
            <Text style={styles.dboyAddInputText}>Name</Text>
            <TextInput
              style={styles.dboyAddInput}
              placeholder={'Name'}
              value={dboyManName}
              onChangeText={name => setdboyManName(name)}
            />
            <Text style={styles.dboyAddInputText}>Contact No</Text>
            <TextInput
              style={styles.dboyAddInput}
              placeholder={'Contact No'}
              onChangeText={Contactno => setDboyManNumber(Contactno)}
              keyboardType={'number-pad'}
              value={dboyManNumber}
              maxLength={10}
            />
            <Text style={styles.dboyAddInputText}>Email</Text>
            <TextInput
              style={styles.dboyAddInput}
              placeholder={'Email'}
              onChangeText={email => setDboyManEmail(email)}
              keyboardType={'email-address'}
              value={dboyManEmail}
            />
            <Text style={styles.dboyAddInputText}>Password</Text>
            <TextInput
              style={styles.dboyAddInput}
              placeholder={'Password'}
              value={dboyManPass}
              onChangeText={password => setDboyManPass(password)}
            />
            <Text style={styles.dboyAddInputText}>Vehicle No.</Text>
            <TextInput
              style={styles.dboyAddInput}
              placeholder={'Vehicle No.'}
              value={dboyManVehicleNo}
              onChangeText={VehicleNo => setDboyManVehicleNo(VehicleNo)}
            />
            <Text style={styles.dboyAddInputText}>Vehicle Type</Text>
            <TextInput
              style={styles.dboyAddInput}
              placeholder={'VehicleType'}
              value={dboyManVehicleType}
              onChangeText={VehicleType => setDboyManVehicleType(VehicleType)}
            />
            <Text style={styles.dboyAddInputText}>Branch</Text>
            <TextInput
              style={styles.dboyAddInput}
              placeholder={'Branch'}
              value={dboyManBranch}
              onChangeText={(BranchType) => setDboyManBranch(BranchType)}
              onFocus={() => setBranchModal(true)}
            />
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Text
                onPress={handleAddDeliveryModalClose}
                style={{
                  color: Globalstyles.color.black,
                  backgroundColor: Globalstyles.color.accept,
                  padding: 10,
                  width: '20%',
                  textAlign: 'center',
                  borderRadius: 10,
                  margin: 10,
                  elevation: 10,
                }}>
                Cancel
              </Text>
              <Text
                onPress={() => {
                  if (dboyEdit) handleEditDeliveryBoy({ isDone: true });
                  else handleAddDeliveryBoy();
                }}
                style={{
                  color: Globalstyles.color.black,
                  backgroundColor: Globalstyles.color.accept,
                  padding: 10,
                  width: '20%',
                  textAlign: 'center',
                  borderRadius: 10,
                  margin: 10,
                  elevation: 10,
                }}>
                {loadingDboyApi ? (
                  <ActivityIndicator color={Globalstyles.color.black} />
                ) : dboyEdit ? (
                  'EDIT'
                ) : (
                  'ADD'
                )}
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
      <Modal visible={branchModal} transparent={true}>
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: '#0000004d'
        }} >

          <View style={{ backgroundColor: '#fff', width: '65%', justifyContent: 'center' }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', height: 40, backgroundColor: Globalstyles.color.UIColor }}>
              <Text style={{ fontFamily: GlobalAppInfo.App.font, color: Globalstyles.color.white }}>
                BRANCH
              </Text>
            </View>

            {apiBranch.map((item, index) => (
              <RadioButton.Group value={index} onValueChange={() => {
                setDboyManBranch(item.branch_name)
                setDboyManId(item.id)
                setBranchModal(false)
              }}>
                <RadioButton.Item value={item.id} label={item.branch_name} />
              </RadioButton.Group>
            ))}

          </View>
        </View>

      </Modal>


    </View>
  );
};

export default DeliveryBoy;

const styles = StyleSheet.create({
  dboyAddInput: {
    width: '100%',
    borderBottomWidth: 2,
    color: Globalstyles.color.black,
  },
  dboyAddInputText: {
    paddingTop: 10,
    color: Globalstyles.color.UIColor,
  },
  searchInput: {
    backgroundColor: "white",
    // width: '60%',
    borderWidth:1,
    borderRadius:5,
    borderColor: Globalstyles.color.UIColor,
    paddingLeft:5,
    height:40,
  }

});
