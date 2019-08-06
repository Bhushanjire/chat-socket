import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'keepCss', pure: false })
export class EscapeCssPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(content) {
    
      return this.sanitizer.bypassSecurityTrustStyle(content);
  }
}