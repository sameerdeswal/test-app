import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import axios from 'axios';
import { FormsModule } from '@angular/forms';
import * as CryptoJS from 'crypto-js'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {
  textAreaData: string = '';
  serverResponse: string = '';
  serverErrorResponse: string = '';
  secretKey: string = 'aVerySecretKey12';


  constructor() { }

  encryptData(data: any) {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(this.secretKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  decryptData(encryptedData: any) {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse(this.secretKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }

  sendData() {
    console.log(this.textAreaData)
    const url = 'http://localhost:8081/backend/encrypt/message';
    const data = this.encryptData({ message: this.textAreaData });
    this.serverResponse = "";
    this.serverErrorResponse = "";
    axios.post(url, {body : data}, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
      .then(response => {
        if (response.data) {
          console.log('Data sent successfully:', response.data);
          let actualResponse = this.decryptData(response.data.response);
          this.serverResponse = actualResponse.message;
        }
      })
      .catch(error => {
        console.error('Error sending data:', error.message);
        this.serverErrorResponse = error.message;
        if (error.response?.data) {
          let actualErrorResponse = this.decryptData(error.response?.data.response)
          this.serverErrorResponse = actualErrorResponse.errorResponse
        }
      });

  }
}

