export default class CompanyService {
    getCompanies() {
        return fetch('demo/data/countries.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
