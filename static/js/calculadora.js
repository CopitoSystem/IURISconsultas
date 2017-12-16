// ######## CALCULADORA ##############
  $('form').submit(false);
  $('#botonVioleta').on('click', function(e) {

    $('#indemnizacion').css('display', 'none');

    // Valores tomados de los input
    causa = parseInt(document.getElementsByName('causa_despido')[0].value);
    preaviso = (document.getElementsByName('preaviso')[0].value == "true");
    ingreso = document.getElementsByName('ingreso')[0].value;
    salida = document.getElementsByName('salida')[0].value;
    salario = parseInt(document.getElementsByName('salario')[0].value);
    
    // Calculos
    ant_anos = antiguedad_anos(ingreso, salida);
    ant_dias = antiguedad_dias(ingreso, salida);
    ant_art_245 = antiguedad_art_245(ant_anos,salario);
    sust_de_preaviso = sustitutiva_de_preaviso(salario, ant_dias);
    sac_preav = sac_preaviso(sust_de_preaviso);
    dias_trabaj_del_mes = dias_trabajados_del_mes(salario, salida);
    dias_hasta_fin_mes = dias_hasta_fin_de_mes(salida);
    integra_mes_de_despido = integracion_mes_de_despido(salario, salida, dias_hasta_fin_mes);
    dias_desde_comien_semetre = dias_desde_comienzo_semetre(ingreso, salida, ant_dias);
    sac_integra_mes_de_despido = sac_integracion_mes_de_despido(integra_mes_de_despido);
    sac_propor = sac_proporcional(salario, dias_desde_comien_semetre);
    vaca_no_gozadas = vacaciones_no_gozadas(salario, ant_dias, ant_anos);
    sac_vaca_no_gozadas = sac_vacaciones_no_gozadas(vaca_no_gozadas);
    reporte = generar_reporte(causa, preaviso, salario, ant_dias, ant_anos, ant_art_245, dias_trabaj_del_mes, sust_de_preaviso, sac_preav, sac_integra_mes_de_despido, sac_propor, vaca_no_gozadas, sac_vaca_no_gozadas);
    console.log([causa, preaviso, salario, ant_dias, ant_anos, ant_art_245, dias_trabaj_del_mes, sust_de_preaviso, sac_preav, sac_integra_mes_de_despido, sac_propor, vaca_no_gozadas, sac_vaca_no_gozadas]);


    $("#salario").html("$ " + reporte[0]);
    $("#antiguedad_anos").html(reporte[1]);
    $("#antiguedad_art_245").html("$ " + reporte[2]);
    $("#sustitutiva_de_preaviso").html("$ " + reporte[3]);
    $("#sac_preaviso").html("$ " + reporte[4]);
    $("#dias_trabajados_del_mes").html("$ " + reporte[5]);
    $("#integracion_mes_de_despido").html("$ " + reporte[6]);
    $("#sac_integracion_mes_de_despido").html("$ " + reporte[7]);
    $("#sac_proporcional").html("$ " + reporte[8]);
    $("#vacaciones_no_gozadas").html("$ " + reporte[9]);
    $("#sac_vacaciones_no_gozadas").html("$ " + reporte[10]);
    $("#total").html("$ " + reporte[11]);
    
    $('#indemnizacion').css('display', '');
    $(window).scrollTop(200);
    
})

  function antiguedad_dias(ingreso, salida) {
    d1 = new Date(ingreso);
    d2 = new Date(salida);
    var timeDiff = Math.abs(d2.getTime() - d1.getTime());
    var diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
    return(diffDays);
  }

  function antiguedad_anos(ingreso, salida) {
    //antiguedad [años] (si es mayor a 6 meses es 1 año)
    d1 = new Date(ingreso);
    d2 = new Date(salida);
    var timeDiff = Math.abs(d2.getTime() - d1.getTime());
    var diffDays = Math.round(timeDiff / (1000 * 3600 * 24 * 365)); 
    return(diffDays);
  }

  function antiguedad_art_245(salario, ant_anos) {
    //Antigüedad Art. 245 = Salario Base * Antiguedad
    return (Math.round(salario * ant_anos));
  }

  function sustitutiva_de_preaviso(salario, antiguedad_dias) {
    /*pago de lo que le hubiese correspondido cobrar al trabajador en el mes o en los meses de preaviso
    Quince días de anticipación para trabajadores que se encuentren en el período de prueba (ver explicación debajo)
    Un mes de anticipación para trabajadores con menos de 5 años de antigüedad
    Dos meses para trabajadores con antigüedad mayor a 5 años*/
    if (antiguedad_dias <= 90) {
        return Math.round((salario / 30) * 15)
    } else if (90 < antiguedad_dias & antiguedad_dias <= 365 * 5) {
        return Math.round(salario)
    } else {
        return Math.round(salario * 2)
    }
  }

  function sac_preaviso(sustitutiva_de_preaviso) {
    //SAC Preaviso = Indemnización por Falta de Preaviso / 12
    return Math.round(sustitutiva_de_preaviso / 12)
  }

  function dias_trabajados_del_mes(salario, salida) {
    /*Días trabajados del mes = Salario Base / 30 días (31) x Cantidad de días Trabajados en el mes*/
    d2 = salida.split("-"); //aaaa-mm-dd
    if ([1,3,5,7,8,10,12].indexOf(parseInt(d2[1])) != -1) {
        dias = 31;
    } else if ([4,6,9,11].indexOf(parseInt(d2[1])) != -1) {
        dias = 30;
    } else if (parseInt(d2[1]) == 2) {
        dias = 28;
    }
    return Math.round((salario / dias) * parseInt(d2[2]));
  }

  function dias_hasta_fin_de_mes(salida) {
        d2 = salida.split("-"); //aaaa-mm-dd
        if ([1,3,5,7,8,10,12].indexOf(parseInt(d2[1])) != -1) {
            return Math.abs((31 - d2[2]))
        } else if ([4,6,9,11].indexOf(parseInt(d2[1])) != -1) {
            return Math.abs((30 - d2[2]))
        } else if (parseInt(d2[1]) == 2) {
            return Math.abs((28 - d2[2]))
        }
  }

  function integracion_mes_de_despido(salario, salida, dias_hasta_fin_de_mes) {
    /*Integración mes de Despido = Salario Base / 30 días (31) * Cantidad de días hasta fin de mes*/
    d2 = salida.split("-"); //aaaa-mm-dd
    if ([1,3,5,7,8,10,12].indexOf(parseInt(d2[1])) != -1) {
        dias = 31;
    } else if ([4,6,9,11].indexOf(parseInt(d2[1])) != -1) {
        dias = 30;
    } else if (parseInt(d2[1]) == 2) {
        dias = 28;
    }
    return Math.round((salario / dias) * dias_hasta_fin_de_mes);
  }

  function sac_integracion_mes_de_despido(integracion_mes_de_despido) {
    //SAC Integración mes de Despido = Integración del mes de despido / 12
    return Math.round(integracion_mes_de_despido / 12);
  }

  function dias_desde_comienzo_semetre(ingreso, salida, antiguedad_dias) {
    if (antiguedad_dias > 180) {
      d1 = salida.split("-");
      if (parseInt(d1[1]) <= 6) {
        mes = 01;
      } else {
        mes = 07;
      }
      d2 = d1[0] + "-" + mes + "-" + d1[2];
      d1 = new Date(ingreso);
      d2 = new Date(d2);
      timeDiff = Math.abs(d2.getTime() - d1.getTime());
      diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
      return(diffDays);
    }
    else {
      d1 = ingreso.split("-");
      d2 = salida.split("-");
      if ((parseInt(d1[1]) <= 6 & parseInt(d2[1]) <= 6) | (6 < parseInt(d1[1]) & parseInt(d1[1]) <= 12 & 6 < parseInt(d2[1]) & parseInt(d2[1]) <= 12)){
        d1 = new Date(ingreso);
        d2 = new Date(salida);
        timeDiff = Math.abs(d2.getTime() - d1.getTime());
        diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
        return(diffDays+1);
      } else {
        if (parseInt(d1[1]) <= 6 & parseInt(d2[1]) > 6) {
          d1 = d2[0] + "-07-01";
        }
        else if (parseInt(d1[1]) > 6 & parseInt(d2[1]) <= 6) {
          d1 = d2[0] + "-01-01";
        }
        d1 = new Date(d1);
        d2 = new Date(salida);
        timeDiff = Math.abs(d2.getTime() - d1.getTime());
        diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
        return(diffDays);
      }
    }
  }

  function sac_proporcional(salario, dias_desde_comienzo_semetre) {
    /*SAC Proporcional = Salario Base /365 x Cantidad de días trabajados del semestre
    (Es importante saber que el SAC se cobra cada 6 meses, entonces si el despido se produce después de junio, el cálculo de los días trabajados del semestre comienza a partir del 1 de julio).*/
    return Math.round((salario / 365) * dias_desde_comienzo_semetre);
  }

  function vacaciones_no_gozadas(salario, antiguedad_dias, antiguedad_anos) {
    /*Vacaciones No Gozadas = 
    14 días: trabajadores con antigüedad en el empleo de hasta 5 años
    21 días: trabajadores con antigüedad en el empleo de hasta 10 años
    28 días: trabajadores con antigüedad en el empleo de hasta 20 años
    35 días: trabajadores con antigüedad en el empleo de más de 20 años
    */
    if (antiguedad_anos <= 5) {
      return Math.round((salario / 25) * Math.round((antiguedad_dias % 365) / (365 / 14)));
    }
    else if (antiguedad_anos <= 10) {
      return Math.round((salario / 25) * Math.round((antiguedad_dias % 365) / (365 / 21)));
    }
    else if (antiguedad_anos <= 20) {
      return Math.round((salario / 25) * Math.round((antiguedad_dias % 365) / (365 / 28)));
    }
    else if (antiguedad_anos > 20) {
      return Math.round((salario / 25) * Math.round((antiguedad_dias % 365) / (365 / 35)));
    }
  }

  function sac_vacaciones_no_gozadas(vaca_no_gozadas) {
    /*SAC Vacaciones No Gozadas = Vacaciones Proporcionales no Gozadas /12*/
    return Math.round(vaca_no_gozadas / 12);
  }

  function generar_reporte(causa, preaviso, salario, ant_dias, ant_anos, ant_art_245, dias_trabaj_del_mes, sust_de_preaviso, sac_preav, sac_integra_mes_de_despido, sac_propor, vaca_no_gozadas, sac_vaca_no_gozadas) {
    //despido sin causa
    if (causa == 1 & ant_dias > 90) {
      //hubo preaviso?
      if (preaviso == true) {
        total = Math.round(ant_art_245 + dias_trabaj_del_mes + integra_mes_de_despido + sac_propor + vaca_no_gozadas + sac_vaca_no_gozadas);
        return([salario, ant_anos, ant_art_245, "0", "0",dias_trabaj_del_mes, integra_mes_de_despido, sac_integra_mes_de_despido, sac_propor, vaca_no_gozadas, sac_vaca_no_gozadas, total]);
      } else {
        total = Math.round(ant_art_245 + sust_de_preaviso + sac_preav + dias_trabaj_del_mes + integra_mes_de_despido + sac_propor + vaca_no_gozadas + sac_vaca_no_gozadas);
        return([salario, ant_anos, ant_art_245, sust_de_preaviso, sac_preav, dias_trabaj_del_mes, integra_mes_de_despido, sac_integra_mes_de_despido, sac_propor, vaca_no_gozadas, sac_vaca_no_gozadas, total]);
      }
    //despido con causa o renuncia
    } else if (causa == 2 | causa == 3 | antiguedad_dias <= 90) {
        total = Math.round(dias_trabaj_del_mes + sac_propor + vaca_no_gozadas + sac_vaca_no_gozadas);
        return([salario, ant_anos,"0", "0", "0", dias_trabaj_del_mes, "0", "0", sac_propor, vaca_no_gozadas, sac_vaca_no_gozadas, total]);
    }
  }
