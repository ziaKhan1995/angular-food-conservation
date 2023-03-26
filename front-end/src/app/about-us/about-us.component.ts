import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  constructor(
    private title:Title,
    private meta:Meta
  ) { }

  ngOnInit(): void {
    this.title.setTitle("About us");
    this.metadataTags();
  }
  metadataTags(){
    this.meta.addTags([  
      { name: 'keywords', content: 'Contact Us' },  
      { name: 'robots', content: 'index, follow' },  
      { name: 'writer', content: 'Zia Khan' }, 
      { name: 'description', content: "FC&Wr is the best place to sell and buy"+
       "surplus food on bidding to avoid" }, 
      { charset: 'UTF-8' }  
    ]);  
  }

}
