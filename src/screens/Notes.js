import { View, Text, Image, TextInput, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons, Entypo, AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { FAB, Menu, Divider, useTheme, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheet } from 'react-native-btr';
import moment from 'moment';
import { RNText } from '../components/RNText';

const Notes = () => {
  const { width, height } = Dimensions.get('window');
  const navigation = useNavigation()
  const theme = useTheme()
  const [notesArray, setNotesArray] = useState([])
  const [title, setTitle] = useState("")
  const [designation, setDesignation] = useState("")
  const [description, setDescription] = useState("")
  const [bottomVisible, setBottomVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("")
  const [menuVisible, setMenuVisible] = useState("")
  const [updateItem, setUpdateItem] = useState("")
  const [edit, setEdit] = useState()
  const [changeStatus, setChangeStatus] = useState(false)

  function bottomtoggle() {
    setBottomVisible((bottomVisible) => !bottomVisible)
  }

  const openNotesMenu = () => setMenuVisible(true);
  const closeNotesMenu = () => setMenuVisible(false);

  useEffect(() => {
    const unsubcribe = navigation.addListener("focus", () => {
      getList()
    })
    return unsubcribe
  }, [])

  const getList = async () => {
    let response = await AsyncStorage.getItem("notes")
    if (response == null) {
      return;
    }
    response = JSON.parse(response)
    setNotesArray(response)
  }

  const addNotes = () => {
    const myObject = {
      id: moment(new Date()).format(),
      title: title,
      designation: designation,
      description: description,
      checked: false,
    }
    if (title == "" || description == "") {
      return;
    }
    notesArray.push(myObject)
    const values = JSON.stringify(notesArray)
    AsyncStorage.setItem("notes", values)
    getList()
    setBottomVisible(false)
    setTitle("")
    setDesignation("")
    setDescription("")
  }

  const notesList = () => {
    var a = notesArray.sort(function (a, b) {
      if (a.title < b.title) {
        return -1;
      }
      else {
        return 0;
      }
    })
    setNotesArray(a)
    AsyncStorage.setItem("notes", JSON.stringify(a))
    getList()
  }

  const notesDescendingList = () => {
    const data = notesArray.sort(function (a, b) {
      if (a.title > b.title) {
        return -1;
      }
      else {
        return 0;
      }
    })
    setNotesArray(data)
    AsyncStorage.setItem("notes", JSON.stringify(data))
    getList()
  }

  const updateNotes = () => {
    let updateData = [...notesArray]
    let index = updateData.findIndex(ele => ele.title == updateItem.title && ele.description == updateItem.description && ele.designation == updateItem.designation)
    updateData[index] = { ...updateData[index], title: title, description: description, designation: designation }
    AsyncStorage.setItem("notes", JSON.stringify(updateData))
    setNotesArray(updateData)
    getList()
  }

  const onDeleteItem = (item) => {
    const deleteNotes = notesArray.filter(ele => ele.title != item.title)
    setNotesArray(deleteNotes)
    AsyncStorage.setItem("notes", JSON.stringify(deleteNotes))
    getList()
  }

  const selectionNoteList = (index) => {
    setNotesArray(prev => {
      prev[index].checked = !prev[index].checked
      return [...prev]
    })
  }
  const selectAllNoteList = () => {
    var selectNotes = notesArray.map((item) => {
      return { ...item, checked: true }
    })
    setNotesArray(selectNotes)
  }

  const unSelectNoteList = () => {
    var unSelectNotes = notesArray.map((item) => {
      return { ...item, checked: false }
    })
    setNotesArray(unSelectNotes)
  }

  const deleteAllItem = () => {
    const deleteDatas = notesArray.filter(ele => !ele.checked)
    setNotesArray(deleteDatas)
    AsyncStorage.setItem("notes", JSON.stringify(deleteDatas))
    getList()
    setEdit(false)
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.elevation.level0 }}>
      <View style={{ flex: 0.8, flexDirection: "row", alignItems: "center", paddingHorizontal: 20, backgroundColor: "#fbede3", justifyContent: "space-between" }}>
        <AntDesign name="arrow-left" size={22} color={theme.colors.primary} onPress={() => navigation.goBack()} />
        <RNText title={"Notes"} fontSize={20} color={theme.colors.primary} variant="bodyMedium" fontWeight="500" />
        <Menu
          visible={menuVisible}
          onDismiss={closeNotesMenu}
          contentStyle={{ backgroundColor: theme.colors.background }}
          anchor={
            <TouchableOpacity onPress={() => { notesArray.length == 0 ? null : openNotesMenu() }}>
              <MaterialCommunityIcons name="dots-vertical" size={22} color={theme.colors.primary} />
            </TouchableOpacity>}
        >
          <Menu.Item title="Ascending" onPress={() => { notesList(); closeNotesMenu() }} />
          <Divider />
          <Menu.Item title="Descending" onPress={() => { notesDescendingList(); closeNotesMenu() }} />
          <Divider />
          <Menu.Item title="Edit" onPress={() => { setEdit(true); setChangeStatus(true); closeNotesMenu(); }} />

        </Menu>
      </View>

      <View style={{ flex: 8 }}>
        {!edit ?
          <View style={{ marginBottom: 10, marginTop: 15 }}>
            <TextInput
              placeholder='Search notes...'
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              style={{
                padding: 10,
                height: 45,
                borderWidth: 0.5,
                borderRadius: 50,
                marginHorizontal: 25,
                borderColor: theme.colors.outline
                , fontFamily: "Roboto_Slab"
              }}
            />
          </View> :
          <View style={{ marginVertical: edit ? 10 : 0 }}>

            <View style={{ marginVertical: 10, flexDirection: "row", alignSelf: "flex-end", marginHorizontal: 10 }}>
              {changeStatus ?
                <TouchableOpacity
                  style={{
                    width: 100,
                    height: 38,
                    borderWidth: 1,
                    borderColor: theme.colors.primary,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    right: 18,
                  }} onPress={() => { selectAllNoteList(); setChangeStatus(false) }}>

                  <RNText title={"SELECT ALL"} color={theme.colors.primary} />
                </TouchableOpacity> :
                <TouchableOpacity
                  style={{
                    width: 120,
                    height: 38,
                    borderWidth: 1,
                    borderColor: theme.colors.primary,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    right: 18,
                  }} onPress={() => { unSelectNoteList(); setChangeStatus(true) }}>
                  <RNText title={"UNSELECT ALL"} color={theme.colors.primary} />
                </TouchableOpacity>
              }
              <TouchableOpacity style={{
                width: 100,
                height: 38,
                borderWidth: 1,
                borderColor: "red",
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
                right: 7
              }} onPress={() => deleteAllItem()}>
                <RNText title={"DELETE"} color={"red"} />
              </TouchableOpacity>
            </View>
          </View>}

        <View style={{ height: "100%", alignSelf: "center" }}>
          <FlatList
            data={notesArray.filter(ele => ele.title.toLowerCase().includes(searchQuery.toLowerCase()))}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={{ height: 150 }}
            >

            </View>
            }
            ListEmptyComponent={() => (
              <View style={{ alignItems: "center", marginVertical: 200 }}>
                <RNText title={"No Notes Available..."} fontSize={17} />
              </View>
            )}
            numColumns={2}
            keyExtractor={item => (item.id).toString()}
            renderItem={({ item, index }) => {
              return (
                <Card
                  style={{
                    width: 160,
                    height: 170,
                    backgroundColor: theme.colors.background,
                    marginBottom: 10,
                    marginHorizontal: 5,
                    borderRadius: 5,

                  }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ReadNotesPage", { data: item })}
                  >
                    <View style={{ flexDirection: "row", marginTop: 8, marginHorizontal: 10, alignItems: "center" }}>
                      <View style={{ width: "88%" }}>
                        <RNText title={""+ moment(new Date(item.id)).format("DD MMM")} fontSize={14} color={theme.colors.onBackground} />
                      </View>
                      {!edit ? <TouchableOpacity >
                        <MaterialIcons name="edit-note" size={22} color={theme.colors.primary}

                          onPress={() => {
                            if (edit) {
                              setBottomVisible(false);
                            }
                            else {
                              setUpdateItem(item);
                              setBottomVisible(true);
                              setTitle(item.title)
                              setDescription(item.description)
                              setDesignation(item.designation)
                            }
                          }} />
                      </TouchableOpacity> :
                        <View>
                          <TouchableOpacity onPress={() => selectionNoteList(index)}>
                            {!item.checked ?
                              <Entypo name="circle" size={17} color={theme.colors.primary} /> :
                              <AntDesign name="check-circle" size={17} color={theme.colors.primary} />}
                          </TouchableOpacity>

                        </View>}
                    </View>

                    <View style={{ padding: 10 }}>
                      <Text style={{ fontSize: 18, color: theme.colors.onBackground, fontWeight: "600", width: "80%" }}>{item.title}</Text>
                      {item.designation && 
                      <RNText title={item.designation}  color={theme.colors.onBackground} />
                      }
                      <View style={{ marginTop: 4 }}>
                        <RNText title={item.description}  color={theme.colors.onBackground}  numberOfLines={3}/>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Card>
              )
            }}
          />

        </View>


        <FAB
          icon={edit ? "undo" : "plus"}
          style={{ position: "absolute", bottom: "10%", right: "8%", backgroundColor: theme.colors.primary, }}
          color={theme.colors.background}
          // onPress={() => navigation.navigate("CreateNotesPage", { datas: notesArray })}
          onPress={() => {
            if (edit) {
              setEdit(false)
              unSelectNoteList()
            }
            else {
              setBottomVisible(true);
              setUpdateItem("")
            }
          }}
        />

        <BottomSheet
          visible={bottomVisible}
          onBackButtonPress={bottomtoggle}
          onBackdropPress={bottomtoggle}
        >
          <View style={{
            height: 430,
            backgroundColor: theme.colors.background,
            padding: 30,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: "relative",
          }}>

            <View style={{ flexDirection: "row", top: -10, justifyContent: "space-between" }}>
              <View>

                <RNText title={"Notes"} fontSize={17} fontWeight="600" />

              </View>
              <TouchableOpacity style={{}}
                onPress={() => {
                  setBottomVisible(false);
                  setTitle("");
                  setDescription("");
                  setDesignation("")
                }
                }
              >
                <Entypo name="cross" size={24} color={theme.colors.onBackground} />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: -10, marginHorizontal: 10, top: 15 }}>
              <View style={{ marginVertical: 5, }}>
                <RNText title={"Title"}  fontWeight="600" />
                
              </View>
              <TextInput
                value={title}
                onChangeText={(text) => setTitle(text)}
                style={{
                  padding: 10,
                  height: 45,
                  borderWidth: 1,
                  borderRadius: 5, fontFamily: "Roboto_Slab"
                }} />
            </View>

            <View style={{ marginTop: 25, marginHorizontal: 10, }}>
              <View style={{ marginVertical: 5, }}>
                <RNText title={"Designation"}  fontWeight="600" />
              </View>
              <TextInput
                value={designation}
                onChangeText={(text) => setDesignation(text)}
                style={{
                  padding: 10,
                  height: 45,
                  borderWidth: 1,
                  borderRadius: 5, fontFamily: "Roboto_Slab"
                }} />
            </View>

            <View style={{ marginTop: 25, marginHorizontal: 10, bottom: 15 }}>
              <View style={{ marginVertical: 5, }}>
                <RNText title={"Description"}  fontWeight="600" />
              </View>
              <TextInput
                value={description}
                multiline={true}
                onChangeText={(text) => setDescription(text)}
                style={{
                  padding: 10,
                  height: 85,
                  borderWidth: 1,
                  borderRadius: 5, fontFamily: "Roboto_Slab"
                }} />
            </View>

            {updateItem ? <TouchableOpacity
              style={{
                width: 100,
                padding: 10,
                height: 45,
                backgroundColor: theme.colors.primary,
                alignSelf: "center",
                marginVertical: 5,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center"
              }} onPress={() => { updateNotes(); setBottomVisible(false) }}>
              <RNText title={"Update"}  color={theme.colors.background} />
            </TouchableOpacity> :
              <TouchableOpacity
                style={{
                  width: 100,
                  padding: 10,
                  height: 45,
                  backgroundColor: theme.colors.primary,
                  alignSelf: "center",
                  marginVertical: 5,
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center"
                }} onPress={() => addNotes()}>
                <RNText title={"Add Note"}  color={theme.colors.background} />
                
              </TouchableOpacity>}
          </View>
        </BottomSheet>
      </View>
    </View>
  )
}

export default Notes







