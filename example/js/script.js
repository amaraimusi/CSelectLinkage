let datalistSelectEx1;

$(()=>{
    
        var data = [
                    {'id':1,'category_a':2,'animal_name':'トカゲ'},
                    {'id':2,'category_a':1,'animal_name':'ネコ'},
                    {'id':3,'category_a':1,'animal_name':'ウシ'},
                    {'id':4,'category_a':2,'animal_name':'ヘビ'},
                    {'id':5,'category_a':2,'animal_name':'カナヘビ'},
                    {'id':6,'category_a':4,'animal_name':'タナゴ'},
                    ];
        
        
        var cSelectLinkage = new CSelectLinkage({
            'main_select_slt':'#animal_sel',
            'category_select_slt':'#category_a_sel',
            'data':data,
            'main_value_field':'id',
            'category_field':'category_a',
            'display_name_field':'animal_name',
            'empty':' --- ',
            'all_category_flg':true,
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
