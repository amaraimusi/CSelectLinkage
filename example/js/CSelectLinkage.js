
/**
 * CSelectLinkage.js カテゴリ連動型SELECT
 * 
 * @note
 * カテゴリ連動型SELECTはカテゴリSELECTと主SELECTの２つから構成される。
 * カテゴリSELECTで選択を行うと、連動して主SELECTの選択リストはカテゴリに属したリストに切り替わる。
 * 
 * 初期値は主SELECTのdata-value属性にセットする。
 * 例→ <select id="animal_sel" data-value="4" ></select>
 * ※ param.valueに初期値をセットしても良い
 * 
 * @version 1.2.1 refreshおよびsetValueを追加
 * @date 2016-11-11 | 2017-2-8
 * 
 * @param param
 * - main_select_slt	主SELECTのセレクタ	
 * - category_select_slt	カテゴリSELECTのセレクタ	
 * - data	エンティティの配列型データ	
 * - main_value_field	エンティティの主値フィールド名	
 * - category_field	エンティティのカテゴリフィールド名	
 * - display_name_field	エンティティの表記フィールド 	
 * - empty	主SELECTの未選択時の表記名	nullをセットすると未選択項目は表示されない。
 * - all_category_flg	全カテゴリフラグ	trueにすると、カテゴリSELECTで空を選択した際、主SELECTを全カテゴリの選択肢を表示する。
 * - def_value	初期値
 */
class CSelectLinkage {
	
	
	constructor(param){
		this.param = param;
        console.log(this.param);//■■■□□□■■■□□□
    
        this.opHtmHash = {}; // 選択肢HTMLハッシュテーブル (key:カテゴリ値 , value:選択肢HTML)
        
        this.allOpHtm = "" // 全選択HTML
            
        this.old_category_v = -1;// 旧カテゴリ値
        
        //let this=this; // Instance of this.
        
        // If Param property is empty, set a value.
        this.param = this._setParamIfEmpty(this.param);
        
        // 選択肢HTMLハッシュテーブルを生成する。
        this.opHtmHash = this._createHtmlHashTable(this.param);
        
        // 全カテゴリフラグがtrueなら全選択HTMLを生成する
        if(this.param.all_category_flg){
            this.allOpHtm = this._createAllOptionHtml(this.param);
        }
        
        // 初期値をセットする
        this._setDefaultValue(this.param);
        

        // カテゴリSELECTにチェンジイベントを登録
        $(this.param.category_select_slt).click(function(e){
            
            let category_v=$(this).val();
            
            // カテゴリSELECTチェンジイベント
            this.categorySelectChange(category_v);

        });
        
	}

	
	// If Param property is empty, set a value.
	_setParamIfEmpty(param){
		
		if(param == undefined){
			param = {};
		}
		
		// 主SELECTのセレクタ
		if(param['main_select_slt'] == undefined){
			throw new Error('A main_select_slt is empty');
		}

		// カテゴリSELECTのセレクタ
		if(param['category_select_slt'] == undefined){
			throw new Error('A category_select_slt is empty');
		}

		// エンティティの配列型データ
		if(param['data'] == undefined){
			throw new Error('The data is empty');
		}

		// エンティティの主値フィールド名
		if(param['main_value_field'] == undefined){
			param['main_value_field'] = 'id';
		}

		// エンティティのカテゴリフィールド名
		if(param['category_field'] == undefined){
			param['category_field'] = 'category_id';
		}

		// エンティティの表記フィールド 
		if(param['display_name_field'] == undefined){
			param['display_name_field'] = 'category_name';
		}

		// 主SELECTの未選択時の表記名
		if(param['empty'] == undefined){
			param['empty'] = null;
		}

		// カテゴリSELECTの全カテゴリの表記名
		if(param['all_category_flg'] == undefined){
			param['all_category_flg'] = false;
		}

		// 初期値
		if(param['def_value'] == undefined){
			param['def_value'] = null;
		}
		
		return param;
	};
	
	/**
	 * 主SELECTに値をセットする
	 * 
	 * @note
	 * セットした値に合わせて、主SELECTおよびカテゴリSELECTを更新する。
	 */
	setValue(def_value){
		
		
		param = this.param;
		
		let msElm = $(param.main_select_slt); // 主SELECT要素
		
		
		// デフォルト値からデフォルトカテゴリ値を取得する
		let def_category_value = null; // デフォルトカテゴリ値
		let data = param.data;
		for(let i in data){
			let ent = data[i];
			let main_v = ent[param.main_value_field]; // 主値を取得
			
			// 主値とデフォルト値が一致するなら、そのエンティティのカテゴリ値をデフォルトカテゴリ値として取得する
			if(main_v == def_value){
				def_category_value = ent[param.category_field];
				break;
			}
		}

		let csElm = $(param.category_select_slt); // カテゴリSELECT要素
		
		// カテゴリSELECTにデフォルトカテゴリ値をセットする
		if(def_category_value!==null){
			csElm.val(def_category_value);
			
			// 主SELECTのoption部分を切り替える
			changeOptionHtml(def_category_value);
			
			// 主SELECTに初期値をセット
			msElm.val(def_value);
		}else{
			this._setForNone();// 値なしの場合の設定処理
		}
		
		this.old_category_v = def_category_value;
	}
	
	
	/**
	 * リフレッシュ
	 * 
	 * @note
	 * 主SELECTのdata-value属性値に合わせて、主SELECTおよびカテゴリSELECTを更新する。
	 */
	refresh(){
		let msElm = $(param.main_select_slt); // 主SELECT要素
		
		// 主SELECT要素にdata-value属性がセットされているなら、初期値として取得する
		let def_value = msElm.attr('data-value');

		this.setValue(def_value);
	};
	
	
	
	
	/**
	 * 選択肢HTMLハッシュテーブルを生成する。
	 * @param param
	 * @return 選択肢HTMLハッシュテーブル
	 */
	_createHtmlHashTable(param){

		// ３つのフィールド名（主値、カテゴリ値、主表記）をparamから取得する
		let main_f = param.main_value_field;
		let category_f = param.category_field;
		let display_f = param.display_name_field;
		
		// カテゴリごとにデータを分類する
		let data2 = {}; // データ2【分類済】
		for(let i in param.data){
			let ent = param.data[i];
			
			// 主値、カテゴリ値、主表記をそれぞれ取得する
			let main_v = ent[main_f];
			let category_v = ent[category_f];
			let display_v = ent[display_f];

			// カテゴリごとに分類
			let ent2 = {'main_v':main_v,'display_v':display_v};
			if(!data2[category_v]){
				data2[category_v]= [];
			}
			data2[category_v].push(ent2);

		}
		
		
		
		
		// 未選択オプションを作成
		let emptyOption = "";
		if(param.empty){
			emptyOption = "<option value=''>" + param.empty + "</option>\n";
		}
		
		let hash = {} // 選択肢HTMLハッシュテーブル
		
		// 選択肢HTMLハッシュテーブルを作成する
		for(let category_v in data2){
			let list = data2[category_v];
		
			let opHtm = emptyOption; // 選択肢HTML
			
			// 選択肢HTMLを作成する
			for(let i in list){
				let ent2 = list[i];
				let display_v = this._xssSanitaizeEncode(ent2.display_v); // XSSサニタイズ（「<>」記号をエンコードしないと選択肢が消えていしまうバグがある）
				opHtm += "<option value='" + ent2.main_v + "'>" + display_v + "</option>\n";
			}
			
			hash[category_v] = opHtm;
			
		}
		
		return hash;
	};
	
	//XSSサニタイズエンコード
	_xssSanitaizeEncode(str){
		if(typeof str == 'string'){
			return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}else{
			return str;
		}
	}
	
	
	
	
	/**
	 * 全選択HTMLを生成する
	 * @param param
	 * @return 全選択HTML
	 */
	_createAllOptionHtml(param){
		// ３つのフィールド名（主値、カテゴリ値、主表記）をparamから取得する
		let main_f = param.main_value_field;
		let category_f = param.category_field;
		let display_f = param.display_name_field;
		
		// 未選択オプションを作成
		let emptyOption = "";
		if(param.empty){
			emptyOption = "<option value=''>" + param.empty + "</option>\n";
		}
		
		let opHtm = emptyOption; // 全選択HTML
		for(let i in param.data){
			let ent = param.data[i];
			
			// 主値、カテゴリ値、主表記をそれぞれ取得する
			let main_v = ent[main_f];
			let display_v = ent[display_f];

			opHtm += "<option value='" + main_v + "'>" + display_v + "</option>\n";
			
		}
		
		return opHtm;
		
	};
	
	
	
	
	/**
	 * 初期値をセットする
	 */
	_setDefaultValue(param){
		
		let msElm = $(param.main_select_slt); // 主SELECT要素
		
		let def_value = null; // 初期値
		
		// 主SELECT要素にdata-value属性がセットされているなら、初期値として取得する
		def_value = msElm.attr('data-value');

		// 初期値が取得できなかった場合、paramから取得を試みる。
		if(def_value==null){
			def_value = param.def_value;
		}
		
		// ここまでで初期値を取得できなかった場合、処理を抜ける。
		if(def_value==null){
			this._setForNone();// 値なしの場合の設定処理
			return;
		}
		
		this.setValue(def_value);
		

	};
	
	
	
	
	
	
	/**
	 * カテゴリSELECTチェンジイベント
	 * @param category_v カテゴリ値
	 */
	categorySelectChange(category_v){

		if(this.old_category_v==category_v){
			return;
		}
		
		if(category_v == undefined || category_v == ""){
			
			// 全カテゴリフラグがtrueなら全選択HTMLをセットする
			if(this.param.all_category_flg){
				$(this.param.main_select_slt).html(this.allOpHtm);
			}
			
		}else{
			// 主SELECTのoption部分を切り替える
			changeOptionHtml(category_v);
		}
		
		this.old_category_v = category_v;

		
	}

	/**
	 * 主SELECTのoption部分を切り替える
	 * @param category_v カテゴリ値
	 */
	changeOptionHtml(category_v){
		// 選択肢HTMLハッシュテーブルから選択肢HTMLを取得する
		let opHtml = this.opHtmHash[category_v];
		
		if(!opHtml){
			opHtml="";
		}
		
		// 主SELECTのoption部分を切り替える
		$(this.param.main_select_slt).html(opHtml);
	}
	
	
	// 値なしの場合の設定処理
	_setForNone(){
		if(this.param.all_category_flg){
			$(this.param.main_select_slt).html(this.allOpHtm);
		}
	}

}