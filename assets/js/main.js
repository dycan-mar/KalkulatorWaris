$(document).ready(function() {
    $(".form-section").hide()
    $("#anak").hide()

    $('#btn-calculate').on('click', function() {
        const harta = parseFloat($('#harta').val()) || 0;
        const jenisPewaris = $('#jenisPewaris').val();
        const suami = parseInt($('#suami').val()) || 0;
        const istri = parseInt($('#istri').val()) || 0;
        const anakLaki = parseInt($('#anakLaki').val()) || 0;
        const anakPerempuan = parseInt($('#anakPerempuan').val()) || 0;
        const ayah = parseInt($('#ayah').val()) || 0;
        const ibu = parseInt($('#ibu').val()) || 0;
        const saudaraLaki = parseInt($('#saudaraLaki').val()) || 0;
        const saudaraPerempuan = parseInt($('#saudaraPerempuan').val()) || 0;



        // Validasi
        if (harta <= 0 || !jenisPewaris) {
            alert('Masukkan total harta dan jenis kelamin pewaris!');
            return;
        }
        if (jenisPewaris === 'perempuan' && istri > 0) {
            alert('Istri hanya berlaku jika pewaris laki-laki!');
            return;
        }
        if (jenisPewaris === 'laki' && suami > 0) {
            alert('Suami hanya berlaku jika pewaris perempuan!');
            return;
        }

        // Logika perhitungan berdasarkan Mazhab Syafi'i
        let sisaHarta = harta;
        let bagian = {};
        let dalil = 'Pembagian berdasarkan QS. An-Nisa: 11-12, 176 dan Hadis Nabi SAW. ';

        // Dzawil Furudh
        if (jenisPewaris === 'perempuan' && suami > 0) {
            const bagianSuami = (anakLaki + anakPerempuan > 0) ? 0.25 : 0.5;
            bagian['Suami'] = bagianSuami * harta;
            sisaHarta -= bagian['Suami'];
            dalil += 'Suami mendapat 1/4 jika ada anak, 1/2 jika tidak ada anak (An-Nisa:12). ';
        } else if (jenisPewaris === 'laki' && istri > 0) {
            const bagianIstri = (anakLaki + anakPerempuan > 0) ? 0.125 / istri : 0.25 / istri;
            bagian['Istri (per orang)'] = bagianIstri * harta;
            sisaHarta -= bagianIstri * harta * istri;
            dalil += 'Istri mendapat 1/8 jika ada anak, 1/4 jika tidak ada anak (An-Nisa:12). ';
        }

        if (ibu > 0) {
            const bagianIbu = (anakLaki + anakPerempuan > 0) ? 1/6 : 1/3;
            bagian['Ibu'] = bagianIbu * harta;
            sisaHarta -= bagian['Ibu'];
            dalil += 'Ibu mendapat 1/6 jika ada anak, 1/3 jika tidak ada anak (An-Nisa:11). ';
        }

        if (ayah > 0) {
            const bagianAyah = (anakLaki + anakPerempuan > 0) ? 1/6 : 0;
            bagian['Ayah (furudh)'] = bagianAyah * harta;
            sisaHarta -= bagian['Ayah (furudh)'];
            dalil += 'Ayah mendapat 1/6 jika ada anak (An-Nisa:11). ';
        }

        if (anakPerempuan > 0 && anakLaki === 0) {
            const bagianAnakP = (anakPerempuan === 1) ? 0.5 : 2/3;
            bagian['Anak Perempuan (total)'] = bagianAnakP * harta;
            sisaHarta -= bagian['Anak Perempuan (total)'];
            dalil += 'Anak perempuan mendapat 1/2 jika tunggal, 2/3 jika lebih dari satu (An-Nisa:11). ';
        }

        // Ashabah
        if (anakLaki > 0) {
            const totalBagianAnak = anakLaki * 2 + anakPerempuan;
            const perBagian = sisaHarta / totalBagianAnak;
            bagian['Anak Laki-laki (per orang)'] = 2 * perBagian;
            if (anakPerempuan > 0) {
                bagian['Anak Perempuan (per orang)'] = perBagian;
            }
            sisaHarta = 0;
            dalil += 'Anak laki-laki mendapat 2x anak perempuan sebagai ashabah (An-Nisa:11). ';
        } else if (sisaHarta > 0 && ayah > 0) {
            bagian['Ayah (ashabah)'] = sisaHarta;
            sisaHarta = 0;
            dalil += 'Ayah mendapat sisa sebagai ashabah (HR. Bukhari & Muslim). ';
        } else if (saudaraLaki > 0 || saudaraPerempuan > 0) {
            if (saudaraPerempuan > 0 && saudaraLaki === 0 && anakLaki === 0 && anakPerempuan === 0 && ayah === 0) {
                const bagianSaudaraP = (saudaraPerempuan === 1) ? 0.5 : 2/3;
                bagian['Saudara Perempuan (total)'] = bagianSaudaraP * harta;
                sisaHarta -= bagian['Saudara Perempuan (total)'];
                dalil += 'Saudara perempuan mendapat 1/2 jika tunggal, 2/3 jika lebih dari satu (An-Nisa:176). ';
            }
            if (saudaraLaki > 0 && anakLaki === 0 && anakPerempuan === 0 && ayah === 0) {
                const totalBagianSaudara = saudaraLaki * 2 + saudaraPerempuan;
                const perBagianS = sisaHarta / totalBagianSaudara;
                bagian['Saudara Laki-laki (per orang)'] = 2 * perBagianS;
                if (saudaraPerempuan > 0) {
                    bagian['Saudara Perempuan (per orang)'] = perBagianS;
                }
                sisaHarta = 0;
                dalil += 'Saudara laki-laki mendapat 2x saudara perempuan sebagai ashabah (An-Nisa:176). ';
            }
        }

        // Tampilkan hasil
        $('#warisTableBody').empty();
        for (let key in bagian) {
            const row = `<tr><td>${key}</td><td>${(bagian[key] / harta).toFixed(3)} bagian</td><td>Rp ${bagian[key].toLocaleString('id-ID')}</td></tr>`;
            $('#warisTableBody').append(row);
        }
        $('#totalHarta').text(`Total Harta Dibagikan: Rp ${harta.toLocaleString('id-ID')} (Sisa: Rp ${sisaHarta.toLocaleString('id-ID')})`);
        $('#dalilText').text(dalil);
        $('#result').fadeIn();
    });
    $("#jenisPewaris").on("input",function(){
        console.log($(this).val())
        if($(this).val()=="laki"){
            $("#perempuan").hide()
            $("#suami").val(0)
            $("#laki").show()
            $(".form-section").show()
        }else if($(this).val()=="perempuan"){
            $("#perempuan").show()
            $("#laki").hide()
            $("#istri").val(0)
            $(".form-section").show()
        }else{
            $(".form-section").hide()

        }
    })
    $(".input-check").on("input",function(){
        console.log($("#anakLaki").val());
        if($("#anakLaki").val()!="0"||$("#anakPerempuan").val()!="0"||$("#ayah").val()!="0"||$("#ibu").val()!="0"){
            $(".saudara").hide()
        }else{
            $(".saudara").show()
        }
    })
    $(".nikah").on("input",function(){
        console.log("input")
        if($("#suami").val()!="0"||$("#istri").val()!="0"){
            $("#anak").show()
        }else{
            $("#anak").hide()

        }
    })
});