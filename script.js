/*******************************
 *
 * Title : Path Probability Simulation
 * Author : Mia Godet, Ylan Luu, David Binh Quang Tran
 * Date: 10/10/2014
 *
 * For MTH2302D at PolyTechnique de Montreal
 *
 ********************************/

/*
Checklist
-normaliser matrice ok
-arranger matrice (format) ok
-button pour iterer infini ok
-matrice statistics
-animation de un seul ok
*/


var positionOfTable = 0;
var myMatrix;

//On change la valeur de nodes et ca recree la matrice
function OnChangeValue( frm )
{
        this.node = parseInt(document.getElementById("square").value);
        CreateTable();
        CreateStatsTable();
}

//force the content into number only
function OnlyNum(frm)
{
    var newVal = parseInt(document.getElementById("startingNode").value);
    //if invalid or negative
    if(newVal < 1 || newVal > this.node || !$.isNumeric(newVal)){
        newVal = 1;
        document.getElementById("startingNode").value = newVal;
    }
}

function start(){

}

//Quand on change la valeur dans la matrice, ca change la matrice interne
function OnChangeMatrix()
{
    GiveNumber();
}

//La structure de la matrice (en fait c'est le constructeur de la classe TheMatrice)
function TheMatrice(n){
    this.node = parseInt(n);
    //make 2D array
    this.array2D = [];
    for(var i=0; i<n; i++){
        this.array2D[i] = [];
    }
    //give name to each cell
    var tempNumber = 0;
    //for each row
    for(var i=0; i<n;i++){
        //for each column
        for(var j=0; j<n;j++){
            this.array2D[i][j] = tempNumber;
            tempNumber++;
        }
    }
}

//Donner les valeurs de la matrice interne sur la matrice externe
function Associate(){
    var numNodes = parseInt(document.getElementById("square").value);
    var c = 0;
    for(var i=0; i<numNodes;i++){
        //for each column
        for(var j=0; j<numNodes;j++){
            document.getElementById(c).value = myMatrix.array2D[i][j];
            c++;
        }
    }
}

//Envoyer les valeurs de la matrice vers la matrice interne
function GiveNumber()
{
    var numNodes = parseInt(document.getElementById("square").value);
    var c = 0;
    for(var i=0; i<numNodes;i++){
        //for each column
        for(var j=0; j<numNodes;j++){
            var newVal = document.getElementById(c).value;
            //on ne veut pas de negatif
            if(newVal < 0 || !$.isNumeric(newVal)){
                newVal = 0;
                document.getElementById(c).value = newVal; //on change la valeur sur la matrice
            }
            myMatrix.array2D[i][j] = newVal;
            c++;
        }
    }
}

//Verifier si les colonnes et les lignes de la matrice respectent une probabilite de 100
function Evaluate(){
    var valid = true;
    var temp = 0;
    var alertText = '';

    ColorReset();

    //Verification de chaque ligne
    for(var i = 0; i < myMatrix.node; i++)
    {
        for(var j = 0; j < myMatrix.node; j++)
        {
            temp += parseInt(myMatrix.array2D[i][j]);
        }

        //Si la somme des valeurs de la ligne n'egale pas 100
        if(parseInt(temp) !== 100)
        {
            valid = false;
            //Mettre en rouge la ligne
            for(var j = 0; j < myMatrix.node; j++)
            {
                document.getElementById(i*myMatrix.node+j).style.backgroundColor = "#b8435b";
            }
        }
        //Reset la somme
        temp = 0;
    }

    //Verification de chaque colonne
    for(var i = 0; i < myMatrix.node; i++)
    {
        for(var j = 0; j < myMatrix.node; j++)
        {
            temp += parseInt(myMatrix.array2D[j][i]);
        }

        //Si la somme des valeurs de la colonne n'egale pas 100
        if(parseInt(temp) !== 100)
        {
            valid = false;
            //Mettre en rouge la colonne
            for(var j = 0; j < myMatrix.node; j++)
            {
                document.getElementById(i+j*myMatrix.node).style.backgroundColor = "#b8435b";
            }
        }
        //Reset la somme
        temp = 0;
    }

    //S'il y a eu une colonne/ligne dont la somme n'égale pas 100
    if(!valid)
    {
        alertText += ' <p class="myText" > The sum of one or more lines or columns is not exactly 100. </p> ';
    }
    document.getElementById("alert").innerHTML = alertText;

    return valid;
}

//choisir une rangee random (depart)
function RandomStart(){
    return (Math.random()*100)%myMatrix.node;
}

//La fonction normaliser
function Normaliser()
{
    var temp = 0;
    var fraction = 0.0;
    //Pour chaque ligne
    for(var i = 0; i < myMatrix.node; i++)
    {
        //On trouve la somme totale de la ligne
        for(var j = 0; j < myMatrix.node; j++)
        {
            temp += parseFloat(myMatrix.array2D[i][j]);
        }

        //on modifie chaque case a sa valeur sur la somme totale
        for(var j = 0; j < myMatrix.node; j++)
        {
            fraction = ((parseFloat(myMatrix.array2D[i][j])) / temp);
            myMatrix.array2D[i][j] = fraction;
        }

        //Reset les variables
        temp = 0;
        fraction = 0;
    }

    Associate();
}

//choisir une colonne (destination)
function RandomDestination(startValue){

    var topValue = 0;
    //get max value by summing a line of matrix
    //console.log("node "+ myMatrix.node);
    for(var j = 0; j < myMatrix.node; j++){
        topValue += parseFloat(myMatrix.array2D[startValue][j]);
    }
    //console.log("topValue "+topValue);

    var temp = 0;
    var i = 0;
    var chose = false;
    //get a random number in range of top value (0 to 1)
    var randomNb = (Math.random() * topValue);
    //console.log("random1 "+myMatrix.array2D[startValue][0]);

    while(!chose&&i<=10){
        temp += parseFloat(myMatrix.array2D[startValue][i]);
        //console.log("temp : "+temp);
        if(randomNb <= temp){
            chose = true;
            //call animmation, start = startValue and destination = i
        }
        else{
            i++;
        }
    }
    //console.log("i : "+i);
    return i;
}

//Reset la matrice
function DoReset(){
    for(var i=0; i<myMatrix.node;i++){
        for(var j=0; j<myMatrix.node;j++){
            myMatrix.array2D[i][j] = 0;
            if(i == j){myMatrix.array2D[i][j] = 1;}
        }
    }
    running = false;
    document.getElementsByClassName('toggleButton')[0].innerHTML = 'Start';
    ColorReset();
    resetDots();
    CreateStatsTable();
}

//reset la couleur des cases
function ColorReset(){
    for(var i = 0; i< myMatrix.node*myMatrix.node; i++ )
    {
        document.getElementById(i).style.backgroundColor = "#FFFFFF";
    }
    Associate();
}

//Creer la table en HTML
function CreateTable(){
    $(function() {
        $( "#slider" ).slider();
        $( "#slider" ).slider( "option", "min", 1 );    //min value
        $( "#slider" ).slider( "option", "max", 100 );   //max value
        $( "#slider" ).slider( "value" , 1);            //default value
    });

    var numNodes = parseInt(document.getElementById("square").value);
    //make sure numNodes is ]0,10]
    if (numNodes >= 10){numNodes = 10;}
    else if( numNodes > 0){}
    else{numNodes = 1;}

    myMatrix = new TheMatrice(numNodes);

    document.getElementById("square").value = parseInt(numNodes);//show change for clarity to user

    var num_rows = numNodes;
    var num_cols = numNodes;
    var theader = '<table border="1">\n';
    var tbody = '';

    //add node's value for each column + ugly formatting
    tbody += '<p class="myText">';
    tbody += '1';

    for( var i=1;i<num_cols;i++){
        tbody += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'+(i+1);
    }
    tbody += ' </p>';

    //generates code as:
    //<input id='table'+positionOfTable type="text" size="1" value=positionOfTable><br>
    //each cell will have id = "X" where X is the value of the position
    for( var i=0; i<num_rows;i++)
    {
        //add node's value for each row
        tbody += ' <p class="myText">'+(i+1);
        if(i<9){
            tbody += '&nbsp&nbsp';
        }
        //add cells
        for( var j=0; j<num_cols;j++)
        {
            tbody += ' <input';
            tbody += ' id = '+positionOfTable;
            tbody += ' type="mtText" onChange="OnChangeMatrix()" size="1" value=';
            tbody += 45;//positionOfTable;
            tbody += '>';
            positionOfTable++;
        }
        tbody += '</p> ';
    }
    positionOfTable = 0;
    var tfooter = '</table>';
    document.getElementById('tableee').innerHTML = theader + tbody + tfooter;
    //reset values in table
    DoReset();
    CreateStatsTable();
}



var circles = document.getElementsByClassName('circle');
var labels = document.getElementsByClassName('label');
function drawCircle(n){
    for(var i = 0; i<n ; i++)
    {
        circle = document.getElementById(circles[i].id);
        if(circle.classList.contains('unpouf')){
            circle.classList.remove('unpouf');
        }
        circle.classList.add('pouf');

        label = document.getElementById(labels[i].id);
        if(label.classList.contains('unpouf')){
            label.classList.remove('unpouf');
        }
        label.classList.add('pouf');
    }
}

function resetCircle(n){
    for(var i = 0; i<n ; i++)
    {
        circle = document.getElementById(circles[i].id);
        if(circle.classList.contains('pouf')){
            circle.classList.remove('pouf');
        }
        circle.classList.add('unpouf');

        label = document.getElementById(labels[i].id);
        if(label.classList.contains('pouf')){
            label.classList.remove('pouf');
        }
        label.classList.add('unpouf');
    }
}

var dots = document.getElementsByClassName('dot');
function drawDot(n){
    dot = document.getElementById('dot1');
    if(dot.classList.contains('unpouf')){
        dot.classList.remove('unpouf');
    }
    dot.classList.add('pouf');
}

function resetDots(){
    for( var z = 0; z < 10; z++){
        dot = document.getElementById('dot1');
        if(dot.classList.contains('pouf')){
                dot.classList.remove('pouf');
        }

        dot.classList.add('unpouf');
    }
    resetPositionDots();
    //setTimeout( resetPositionDots, 1500 );
}

function resetPositionDots(){
    for(var z = 0; z<10 ; z++)
    {
       moveDot(z, z);
    }
}

function removeClass(myDot){
   if(myDot.classList.contains('move1')){
        myDot.classList.remove('move1');
   }
   if(myDot.classList.contains('move2')){
        myDot.classList.remove('move2');
   }
   if(myDot.classList.contains('move3')){
        myDot.classList.remove('move3');
   }
   if(myDot.classList.contains('move4')){
        myDot.classList.remove('move4');
   }
   if(myDot.classList.contains('move5')){
        myDot.classList.remove('move5');
   }
   if(myDot.classList.contains('move6')){
        myDot.classList.remove('move6');
   }
   if(myDot.classList.contains('move7')){
        myDot.classList.remove('move7');
   }
   if(myDot.classList.contains('move8')){
        myDot.classList.remove('move8');
   }
   if(myDot.classList.contains('move9')){
        myDot.classList.remove('move9');
   }
   if(myDot.classList.contains('move10')){
        myDot.classList.remove('move10');
   }
}

function moveDot(whichDot, position){
    setStatsTable(position);
    dot = document.getElementById('dot1');

    removeClass(dot);
    switch (position){
            case 0 : dot.classList.add('move1');
                break;
            case 1 : dot.classList.add('move2');
                break;
            case 2 : dot.classList.add('move3');
                break;
            case 3 : dot.classList.add('move4');
                break;
            case 4 : dot.classList.add('move5');
                break;
            case 5 : dot.classList.add('move6');
                break;
            case 6 : dot.classList.add('move7');
                break;
            case 7 : dot.classList.add('move8');
                break;
            case 8 : dot.classList.add('move9');
                break;
            case 9 : dot.classList.add('move10');
                break;
            default : dot.classList.add('move1');
    }
    //dot.classList.add('pouf');
}

var previous;
var running = false;
var secBetweenIt;
function Running(){
    drawDot(previous);
    console.log("current node: "+previous);
    var newPos;
    //get new position
    newPos = RandomDestination(previous);
    console.log("next node:"+newPos);
    moveDot(0, newPos);
    previous = newPos;



    //if it has to run, run in 1000ms
    if(running){
        setTimeout( Running, secBetweenIt );
        $( "#slider" ).slider({ disabled: true });
    }else{
        $( "#slider" ).slider({ disabled: false });
    }
}

//when clicking on start button
document.getElementsByClassName('toggleButton')[0].onclick = function() {
  resetCircle(10);

    drawCircle(myMatrix.node);
    if(this.innerHTML === 'Start')
    {
        Normaliser();
        previous = parseInt(document.getElementById("startingNode").value)-1;
        console.log("start:" + previous);
        this.innerHTML = 'Stop';
        //initialize dot
        moveDot(0, previous);
        //run the animation
        running = true;
        secBetweenIt = 1000/parseInt($("#slider").slider( "value" ));

        Running();

    }
    //if button says stop, stop the animation
    else if(this.innerHTML === 'Stop') {
        //this.innerHTML = 'Second Step';

        running = false;
        //set button to start value
        this.innerHTML = 'Start';

    }

}

//called when the slider changes value
$( "#slider" ).slider({
  change: function( event, ui ) {
      //prendre la valeur du slider et l'appliquer au zoom
      var value = $( "#slider" ).slider( "value" );
      document.getElementById('speed').innerHTML = value;
  }
});

  var myArray  = new Array();

//get value into %
function getPercent(){
    var percent = new Array
    for (var i = 0; i<10; i++)
    {
        percent[i] = myArray[i];
    }
    var sum=0;

    for (var i = 0; i<10; i++)
    {
       /* if (percent[i] === 0)
        {
            sum = parseInt(sum + 1);
        }
        else*/{
            sum += parseFloat(percent[i]);
        }
    }
    for (var i = 0; i<10; i++)
    {
        percent[i] = Math.round((percent[i]/sum*100) * 100) / 100;
    }

    return percent;

}
 function clearArray(){

    myArray[0] = 0;
    myArray[1] = 0;
    myArray[2] = 0;
    myArray[3] = 0;
    myArray[4] = 0;
    myArray[5] = 0;
    myArray[6] = 0;
    myArray[7] = 0;
    myArray[8] = 0;
    myArray[9] = 0;
    return myArray;
 }
function CreateStatsTable(){

    clearArray();

    var myTable= "<table><tr><td style='width: 100px; color: red;'>Node</td>";
    myTable+= "<td style='width: 100px; color: red; text-align: right;'>n of visits</td>";
    myTable+="<td style='width: 100px; color: red; text-align: right;'>% of visits</td></tr>";

    myTable+="<tr><td style='width: 100px;                   '>---------------</td>";
    myTable+="<td     style='width: 100px; text-align: right;'>---------------</td>";
    myTable+="<td     style='width: 100px; text-align: right;'>---------------</td></tr>";

    //list all labels
    for (var i=0; i<10; i++) {
        myTable+="<tr><td style='width: 100px;'> "+ (i+1) + " :</td>";
        myTable+="<td style='width: 100px; text-align: right;'>" + myArray[i] + "</td>";
        myTable+="<td style='width: 100px; text-align: right;'>" + myArray[i] + " %</td></tr>";
    }

    myTable+="<tr><td style='width: 100px;                   '>---------------</td>";
    myTable+="<td     style='width: 100px; text-align: right;'>---------------</td>";
    myTable+="<td     style='width: 100px; text-align: right;'>---------------</td></tr>";

    var sum=0.0;
    for (var i=0;i <10;i++)
    {
        sum += parseFloat(myArray[i]);
    }

    myTable+= "<table><tr><td style='width: 100px; color: blue;'>Total</td>";
    myTable+="<td style='width: 100px; text-align: right; color : blue;'>" + (sum) + "</td>";
    myTable+="<td style='width: 100px; text-align: right; color: blue;'>" + (sum) + " %</td></tr>";

   myTable+="</table>";

    document.getElementById('tablePrint').innerHTML = myTable;


}

function setStatsTable(dot){
    myArray[dot]+=1;
    var percent = getPercent();


    var myTable= "<table><tr><td style='width: 100px; color: red;'>Node</td>";
    myTable+= "<td style='width: 100px; color: red; text-align: right;'>n of visits</td>";
    myTable+="<td style='width: 100px; color: red; text-align: right;'>% of visits</td></tr>";

    myTable+="<tr><td style='width: 100px;                   '>---------------</td>";
    myTable+="<td     style='width: 100px; text-align: right;'>---------------</td>";
    myTable+="<td     style='width: 100px; text-align: right;'>---------------</td></tr>";

    for (var i=0; i<10; i++) {
        myTable+="<tr><td style='width: 100px;'> "+ (i+1) + " :</td>";
        myTable+="<td style='width: 100px; text-align: right;'>" + myArray[i] + "</td>";
        myTable+="<td style='width: 100px; text-align: right;'>" + percent[i] + " %</td></tr>";
    }

    myTable+="<tr><td style='width: 100px;                   '>---------------</td>";
    myTable+="<td     style='width: 100px; text-align: right;'>---------------</td>";
    myTable+="<td     style='width: 100px; text-align: right;'>---------------</td></tr>";

    var sum=0.0;
    var perSum = 0;
    for (var i=0;i <10;i++)
    {
        sum += parseFloat(myArray[i]);
        perSum += parseFloat(percent[i]);
    }

    myTable+= "<table><tr><td style='width: 100px; color: blue;'>Total</td>";
    myTable+="<td style='width: 100px; text-align: right; color : blue;'>" + (sum) + "</td>";
    myTable+="<td style='width: 100px; text-align: right; color: blue;'>" + parseInt(perSum) + " %</td></tr>";

   myTable+="</table>";

    document.getElementById('tablePrint').innerHTML = myTable;


};
