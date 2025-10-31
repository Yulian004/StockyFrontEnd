import {Pipe, PipeTransform} from '@angular/core';


@Pipe({
  name: 'typeLabel',
  standalone: true
})

export class TypeLabelPipe implements PipeTransform{

  private readonly  map: Record<string, string> ={
    ADD: 'Carico',
    SUB: 'Scarico',
    ADJUSTMENT: 'Rettifica'
  };

  transform(value:string | null | undefined, fallback = 'N/D'):string{
    if(!value) return fallback;
    return this.map[value] ?? value;
  }
}
