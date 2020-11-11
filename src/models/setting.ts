import { Reducer } from 'redux';
import { Effect } from 'dva';
import defaultSettings, { DefaultSettings } from '../../config/defaultSettings';
import apis from '@/services';

export interface SettingModelType {
  namespace: 'settings';
  state: Partial<DefaultSettings>;
  effects: {
    settingData: Effect;
    fetchConfig: Effect;
  },
  reducers: {
    changeSetting: Reducer<DefaultSettings>;
  };
}

const updateColorWeak: (colorWeak: boolean) => void = colorWeak => {
  const root = document.getElementById('root');
  if (root) {
    root.className = colorWeak ? 'colorWeak' : '';
  }
};

const SettingModel: SettingModelType = {
  namespace: 'settings',
  state: {},
  effects: {
    *fetchConfig({ payload, callback }, { call, put }) {
      // const response: any = yield call(apis.systemConfig.list);
      const response = {
        "result":
        {
          "primaryColor": "#1890ff", "layout": "sidemenu", "contentWidth": "Fluid",
          "fixedHeader": false, "autoHideHeader": false,
          "fixSiderbar": false, "colorWeak": false,
          "pwa": false, "iconfontUrl": "",
          "title": "运行维护管理系统",
          "menu": { "locale": true },
          "navTheme": "dark"
        }, "status": 200, "code": "success"
      };
      callback(response.result);
      if (response.status === 200) {
        const tempSetting = Object.keys(response.result).length === 0 ? defaultSettings : response.result;
        yield put({
          type: 'changeSetting',
          payload: tempSetting
        })
      }
    },
    *settingData({ payload }, { call, put }) {
      const response: any = yield call(apis.systemConfig.update, payload);
      if (response.status === 200) {
        document.getElementById('title-icon')!.href = payload.titleIcon;
        yield put({
          type: 'changeSetting',
          payload
        });
      }
    }
  },
  reducers: {
    changeSetting(state, { payload }) {
      const { colorWeak, contentWidth } = payload;
      if (state && state.contentWidth !== contentWidth && window.dispatchEvent) {
        window.dispatchEvent(new Event('resize'));
      }
      updateColorWeak(!!colorWeak);
      return {
        ...state,
        ...payload,
      };
    },
  },
};
export default SettingModel;
