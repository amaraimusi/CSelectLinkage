/**
 * datalist型テキストボックスをSELECTボックスに近い感覚で扱えるようにするクラス
 * @since 2023-1-30
 * @version 1.1.0
*/
class DatalistSelectEx{
	
	/**
	* コンストラクタ
	* @param {}
	*  - string inp_id_xid ○○_idのinput要素のid属性
	*  - string inp_name_xid name用のinput要素のid属性
	*  - string clear_xid クリアボタン要素のid属性
	*  - string err_xid エラー表示要素(<span>や<div>など)のid属性
	*  - string datalist_xid datalist要素のid属性
	*  - int def_value 空時の値。未セットなら0
	*/
	constructor(p_dataList, param){
		
		if(param == null) throw Error('引数のparamが未セットになっています');
		
		if(param.def_value == undefined) param.def_value = 0;
		
		if(param.inp_id_xid == null) throw Error('引数paramのinp_id_xidが未セットです。');
		if(param.inp_name_xid == null) throw Error('引数paramのinp_name_xidが未セットです。');
		if(param.clear_xid == null) throw Error('引数paramのclear_xidが未セットです。');
		if(param.err_xid == null) throw Error('引数paramのerr_xidが未セットです。');
		if(param.datalist_xid == null) throw Error('引数paramのdatalist_xidが未セットです。');
		this.param = param;

		this.jqInpId = $('#' + param.inp_id_xid);
		this.jqInpName = $('#' + param.inp_name_xid);
		this.jqClear = $('#' + param.clear_xid);
		this.jqErr = $('#' + param.err_xid);
		this.jqDatalist = $('#' + param.datalist_xid);
		
		if(this.jqInpId[0] == null) throw Error('引数：inp_id_xidの要素を取得できませんでした。');
		if(this.jqInpName[0] == null) throw Error('引数：inp_name_xidの要素を取得できませんでした。');
		if(this.jqClear[0] == null) throw Error('引数：err_clearの要素を取得できませんでした。');
		if(this.jqErr[0] == null) throw Error('引数：err_xidの要素を取得できませんでした。');
		if(this.jqDatalist[0] == null) throw Error('引数：datalist_xidの要素を取得できませんでした。');

		this.jqInpName.change(evt=>{
			// テキストボックスのchangeイベント
			let tbox = $(evt.currentTarget);
			this.onChange(tbox);
		});
		
		
		this.jqClear.click(evt=>{
			// クリアボタンのclickイベント
			let btn = $(evt.currentTarget);
			this.clickClearBtn(btn);
		});

		this.protDataList = null;
		this.dataList = null;

		this.refresh(p_dataList, param);
		
	}
	
	/**
	* リフレッシュ
	* @param {} p_dataList 省略可
	*/	
	refresh(p_dataList, param){
		
		if(this.param == null){
			this.param = param;
		}else{
			if(param != null){
				for(let key in param){
					this.param[key] = param[key];
				}
			}
		}
		
		if(this.protDataList == null){
			this.protDataList = p_dataList;
		}else{
			if(p_dataList != null){
				this.protDataList = p_dataList;
			}
		}
		
		// データリストを作成する(重複対策をする）
		this.dataList = this._makeDataList(this.protDataList);
		
		// datalist要素のoption要素HTMLを作成する
		let datalist_option = this._generateOptionHTML(this.dataList);
		this.jqDatalist.html(datalist_option);
		
		// ▽ 初期セットされている○○idを取得し、それに紐づくnameをテキストボックスにデフォルト表示する
		let any_id = this.jqInpId.val();
		let name = this._getNameFromDataListByAnyId(this.dataList, any_id);
		this.jqInpName.val(name);
		
	}
	
	
	
	/**
	* テキストボックスのチェンジイベント
	* @param jQuery tbox
	*/	
	onChange(tbox){
		this.jqErr.html('');
		let name = tbox.val();
		
		// dataListからnameに紐づくidとエラーメッセージを取得する
		let res = this._findIdFromDataList(name);
		
		this.jqErr.html(res.err_msg);
		if(res.err_msg == '') this.jqInpId.val(res.id);
		

	}
	
	
		
	// dataListからnameに紐づくidとエラーメッセージを取得する
	_findIdFromDataList(name){
		let res = {'id':this.param.def_value, 'err_msg':''};
		if(name=='' || name==null) return res;
		
		let name1 = name.trim();
		for(let id in this.dataList){
			let name2 = this.dataList[id];
			name2 = name2.trim();
			res.id = id;
			if(name1 == name2) return res;
		}
		
		res.err_msg = `「${name1}」に該当するデータがリストに存在しません。`
		return res;
	}
		
	
	
	// データリストを作成する
	_makeDataList(protDataList){
		let dataList = {};
		
		for(let i in protDataList){
			dataList[i] = protDataList[i];
		}
		
		for(let i1 in dataList){
			for(let i2 in dataList){
				if(i1 == i2) continue;

				let name1 = dataList[i1];
				let name2 = dataList[i2];
				if(name1 == name2){
					dataList[i2] = name2 + '(' + i2 + ')';
				}
			}
		}
		
		return dataList;
	}
	
	
	// datalist要素のoption要素HTMLを作成する
	_generateOptionHTML(dataList){
		let datalist_option = '';
		for(let i in dataList){
			let name = dataList[i];
			datalist_option += `<option value="${name}">`;
		}

		return datalist_option;
	}
	
	
	// any_idを指定してnameをDataListから取得する
	_getNameFromDataListByAnyId(dataList, any_id){
		let name = dataList[any_id];
		if(name == null) name = '';
		return name;
	}
	
	// クリアボタンのclickイベント
	clickClearBtn(btn){
		this.jqInpId.val(this.param.def_value);
		this.jqInpName.val('');
	}
    
    /**
     * エラーチェックをする
     * @return string エラーメッセージ
     */
    checkError(){
        
        let name = this.jqInpName.val();
        
        // dataListからnameに紐づくidとエラーメッセージを取得する
        let res = this._findIdFromDataList(name);
        
        return res.err_msg;
    }
	
	
}