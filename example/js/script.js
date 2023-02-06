let datalistSelectEx1;

$(()=>{
    
        var data = [
                    {'animal_id':1,'category_a':2,'animal_name':'トカゲ'},
                    {'animal_id':2,'category_a':1,'animal_name':'ネコ'},
                    {'animal_id':3,'category_a':1,'animal_name':'ウシ'},
                    {'animal_id':4,'category_a':2,'animal_name':'ヘビ'},
                    {'animal_id':5,'category_a':2,'animal_name':'カナヘビ'},
                    {'animal_id':6,'category_a':4,'animal_name':'タナゴ'},
                    ];
        
        
        var cSelectLinkage = new CSelectLinkage({
            'main_select_slt':'#animal_id', // 主SELECTのセレクタ | リストはカテゴリSELECTの値に連動して変化します。
            'category_select_slt':'#category_id', // カテゴリSELECTのセレクタ 
            'main_field':'animal_id',
            'category_field':'category_a',
            'display_name_field':'animal_name',
            'data':data, // 主SELECTのリストで使われるデータです。 main_field, category_field, display_name_fieldで指定されたプロパティで構成されるエンティティの配列です。
            'empty':' --- ', // 主SELECTの未選択時の表記名    nullをセットすると未選択項目は表示されません。
            'all_category_flg':true, //     全カテゴリフラグ    trueにすると、カテゴリSELECTで空を選択した際、主SELECTを全カテゴリの選択肢を表示します。
        });
    
});


// Submitボタン押下アクション
function onSubmit1(){
    
    $('#valid_err_msg').html('');
    let err_msg = datalistSelectEx1.checkError();
    
    if(err_msg){
        $('#valid_err_msg').html(err_msg);
        return false;
    }

    return true;
    
}
