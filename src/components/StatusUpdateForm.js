import React from 'react';
import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import { Avatar, OgBlock } from 'react-native-activity-feed';
import { mergeStyles } from '../utils';
import _ from 'lodash';
import Symbol from 'es6-symbol';

const ImageState = Object.freeze({
  NO_IMAGE: Symbol('no_image'),
  UPLOADING: Symbol('uploading'),
  UPLOADED: Symbol('uploaded'),
  UPLOAD_FAILED: Symbol('upload_failed'),
});

const urlRegex = /(https?:\/\/[^\s]+)/gi;

export default class StatusUpdateForm extends React.Component {
  constructor(props) {
    super(props);
    this.props.feedUserId = this.props.feedUserId || props.session.userId;
    this._handleOgDebounced = _.debounce(this.handleOG, 250);
    this.TextInput = React.createRef();
    this.ScrollView = React.createRef();
  }

  static defaultProps = {
    activity_verb: 'post',
    feedGroup: 'timeline',
  };

  state = {
    image: null,
    imageState: ImageState.NO_IMAGE,
    og: null,
    ogScraping: false,
    ogLink: null,
    textInput: null,
    orientation: 'portrait',
    urls: [],
    dismissedUrls: [],
  };

  _pickImage = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [4, 3],
    });

    if (result.cancelled) {
      return;
    }

    console.log(result);

    this.setState({
      image: result.uri,
      imageState: ImageState.UPLOADING,
    });

    console.log(this.props.session);
    console.log(this.props.session.images);
    console.log(this.props.session.images.upload);

    let response = await this.props.session.images.upload(result.uri);
    console.log(response);

    this.setState({
      imageState: ImageState.UPLOADED,
      image_url: response.file,
    });
  };

  _removeImage = () => {
    this.setState({
      imageState: ImageState.NO_IMAGE,
      image_url: null,
      image: null,
    });
  };

  componentDidMount() {
    this.TextInput.current.focus();

    const { width, height } = Dimensions.get('window');
    this.setState({
      orientation: width > height ? 'landscape' : 'portrait',
    });

    this.props.registerSubmit(async () => {
      this.buildActivity();
    });
  }

  componentWillUnmount() {
    this.TextInput.current.blur();
    // TODO: do we have to deregister the submit cb from navigation?
  }

  buildActivity() {
    let attachments = {
      images: this.state.image_url ? [this.state.image_url] : [],
      og: this.state.og ? this.state.og : {},
    };
    const activity = {
      actor: this.props.session.user,
      verb: this.props.activity_verb,
      object: this.state.textInput,
      attachments,
    };
    console.log(
      `adding actvity to feed ${this.props.feedGroup}:${this.props.feedUserId}`,
    );
    console.log(activity);

    this.props.session
      .feed(this.props.feedGroup, this.props.feedUserId)
      .addActivity(activity)
      .then((resp) => {
        console.log(resp);
        this.props.navigation.navigate('Home');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleScroll() {
    this.ScrollView.current.scrollToEnd();
  }

  handleOG(text) {
    this.handleScroll();
    if (this.state.ogScraping) {
      return;
    }
    console.log(`changed into ${text}`);
    const urls = text.match(urlRegex);

    if (!urls) {
      this.setState({
        og: null,
        ogLink: null,
      });
      return;
    }

    console.log(urls);
    console.log(this.state.dismissedUrls.indexOf(urls[0]) > -1);
    urls.forEach((url) => {
      if (
        url !== this.state.ogLink &&
        !(this.state.dismissedUrls.indexOf(url) > -1) &&
        !this.state.og &&
        urls.indexOf(url) > -1
      ) {
        console.log(`retrieving ${url} from OG API`);
        this.setState({
          ogScraping: true,
          ogLink: url,
          og: url === this.state.ogLink ? this.state.og : null,
        });
        this.props.session
          .og(url)
          .then((resp) => {
            console.log(resp);
            const oldStateUrls = this.state.urls;
            this.setState(
              {
                og: Object.keys(resp).length > 0 ? { ...resp, url: url } : null, // Added url manually from the entered URL
                ogScraping: false,
                urls: [...oldStateUrls, url],
              },
              () => text.replace(url, ''),
            );
          })
          .catch((err) => {
            console.log(err);
            this.setState({
              ogScraping: false,
              og: null,
            });
          });
      }
    });
  }

  _onPressDismiss = (url) => {
    const oldDismissedUrls = this.state.dismissedUrls;
    this.setState(
      {
        dismissedUrls: [...oldDismissedUrls, url],
        ogScraping: false,
        ogLink: null,
        og: null,
      },
      () => {
        console.log('dismissedUrls: ', this.state.dismissedUrls);
      },
    );
  };

  render() {
    Dimensions.addEventListener('change', (dimensions) => {
      // you get:
      this.setState({
        orientation:
          dimensions.window.width > dimensions.window.height
            ? 'landscape'
            : 'portrait',
      });
    });
    return (
      <SafeAreaView style={mergeStyles('screenContainer', styles, this.props)}>
        <View style={mergeStyles('newPostContainer', styles, this.props)}>
          {this.state.orientation === 'portrait' && (
            <Avatar
              source={this.props.session.user.data.profileImage}
              size={48}
            />
          )}
          <ScrollView
            style={mergeStyles('textInput', styles, this.props)}
            ref={this.ScrollView}
          >
            <TextInput
              multiline
              onChangeText={(text) => {
                this.setState({ textInput: text });
                this._handleOgDebounced(text);
              }}
              ref={this.TextInput}
              placeholder="Share something..."
              underlineColorAndroid="transparent"
            />
          </ScrollView>
        </View>

        <View>
          <KeyboardAccessory backgroundColor="#fff">
            {this.state.og && this.state.orientation === 'portrait' ? (
              <OgBlock
                onPressDismiss={this._onPressDismiss}
                og={this.state.og}
                styles={{
                  wrapper: {
                    padding: 15,
                    paddingTop: 8,
                    paddingBottom: 8,
                    borderTopColor: '#eee',
                    borderTopWidth: 1,
                  },
                  textStyle: { fontSize: 12 },
                }}
              />
            ) : null}
            <View style={mergeStyles('accessory', styles, this.props)}>
              {this.state.image ? (
                <View style={mergeStyles('imageContainer', styles, this.props)}>
                  <Image
                    source={{ uri: this.state.image }}
                    style={
                      this.state.imageState === ImageState.UPLOADING
                        ? styles.image_loading
                        : styles.image
                    }
                  />
                  <View style={mergeStyles('imageOverlay', styles, this.props)}>
                    {this.state.imageState === ImageState.UPLOADING ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <TouchableOpacity onPress={this._removeImage}>
                        <Image
                          source={require('../images/icons/close-white.png')}
                          style={{ width: 24, height: 24 }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  title="Pick an image from camera roll"
                  onPress={this._pickImage}
                >
                  <Image
                    source={require('../images/icons/gallery.png')}
                    style={{ width: 24, height: 24 }}
                  />
                </TouchableOpacity>
              )}
              {this.state.og && this.state.orientation === 'landscape' ? (
                <OgBlock
                  onPressDismiss={this._onPressDismiss}
                  og={this.state.og}
                  styles={{
                    wrapper: {
                      padding: 0,
                      paddingTop: 0,
                      paddingBottom: 0,
                      marginTop: -15,
                      marginBottom: -15,
                      marginLeft: 15,
                      borderTopColor: 'transparent',
                      borderTopWidth: 1,
                      flex: 1,
                    },
                    textStyle: { fontSize: 12 },
                  }}
                />
              ) : null}
            </View>
          </KeyboardAccessory>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  newPostContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    flexDirection: 'row',
    flex: 1,
  },
  textInput: {
    flex: 1,
    marginTop: 10,
    marginLeft: 15,
  },
  accessory: {
    borderTopColor: '#DADFE3',
    backgroundColor: '#f6f6f6',
    borderTopWidth: 1,
    width: 100 + '%',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: 30,
    height: 30,
    marginTop: -3,
    marginBottom: -3,
    overflow: 'hidden',
    borderRadius: 4,
  },
  imageOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  image: {
    position: 'absolute',
    width: 30,
    height: 30,
  },
  image_loading: {
    position: 'absolute',
    width: 30,
    height: 30,
    opacity: 0.5,
  },
});
