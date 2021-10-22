import axios from "axios"
import endpoints from "../config/endpoints";
export default class ApiService {
    // Initializing important variables
    constructor(domain) {
        this.domain = domain || endpoints.api // API server domain
        // this.domain = domain || 'http://localhost:8000/api' // API server domain
        // this.domainp = domain || 'https://api1.taplingua.com/v1' // API server domain
        //this.domain = domain || 'http://local.ybrantcompass.com/taplingua-prod/taplingua-api' // API server domain
        this.fetch = this.fetch.bind(this) // React binding stuff
        this.addEmpCourse = this.addEmpCourse.bind(this)
        this.token = localStorage.getItem('id_token');

    }
    //update Single Employee	
    updateEmployee(params) {
        return axios.put(`${this.domain}/employee/${params.userId}`,
            JSON.stringify(params), {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
        }
        ).then(res => {
            return Promise.resolve(res);
        })
    }
    //get employee details
    getEmployeeDetails(userId) {
        var params = "userId=" + userId;
        return axios.get(`${this.domain}/employee-course-registered?` + params, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }).then(res => {
            /* var emailList = []
            for(var i = 0; i < res.data.length; i++){
                if(res.data[i]['fcmToken']!==""){
                    emailList.push({"value":res.data[i]['fcmToken'],"label":res.data[i]['userId']})
                }
            } */
            return Promise.resolve(res.data);
        })
    }
    //Add Single Employee	
    addEmployee(params) {
        return axios.post(`${this.domain}/employee`,
            params, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return Promise.resolve(res);
        })
    }
    //All email sent list
    sendEmailAll(params) {
        return axios.post(`${this.domain}/send-welcome-email`,
            JSON.stringify({ params }), {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        }
        ).then(res => {
            return Promise.resolve(res);
        })
    }
    //weekly email sent list
    sendWeeklyEmail(params) {
        return axios.post(`${this.domain}/send-weekly-email`,
            JSON.stringify({ params }), {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        }
        ).then(res => {
            return Promise.resolve(res);
        })
    }
    //route email sent list
    sendRouteEmail(params) {
        return axios.post(`${this.domain}/send-route-email`,
            JSON.stringify({ params })
        ).then(res => {
            return Promise.resolve(res);
        })
    }
    //firebase email list
    sendPush(params) {
        return axios.post(`${this.domain}/send-push-notification`,
            JSON.stringify({ params }), {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        }
        ).then(res => {
            return Promise.resolve(res);
        })
    }
    //email sent list
    sendEmail(params) {
        return axios.post(`${this.domain}/send-email`,
            JSON.stringify({ params }), {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        }
        ).then(res => {
            return Promise.resolve(res);
        })
    }
    //firebase email list
    getEmailList(companyCode) {
        var params = "CompanyCode=" + companyCode;
        return axios.get(`${this.domain}/getEmployee.php?` + params).then(res => {
            var emailList = []
            for (var i = 0; i < res.data.length; i++) {
                if (res.data[i]['fcmToken'] !== "") {
                    emailList.push({ "value": res.data[i]['fcmToken'], "label": res.data[i]['userId'] })
                }
            }
            return Promise.resolve(emailList);
        })
    }

    //get Completion Reports Data
    getCompletionReports(companyCode, moduleNo, batchNumber, routeNumber) {
        return axios.get(`${this.domain}/completion-report-average?companyCode=` + companyCode + `&courseNumber=` + moduleNo + `&batchNumber=` + batchNumber + `&routeNumber=` + routeNumber, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }).then(res => {
            return Promise.resolve(res.data);
        })
    }
    //get Route Data
    getRouteList(courseNo) {
        return axios.get(`${this.domain}/route-list?courseNo=` + courseNo, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }).then(res => {
            let routeList = []
            for (var i = 0; i < res.data.length; i++) {
                routeList.push({ "value": res.data[i]['routeNo'], "label": res.data[i]['description'], "id": res.data[i]['id'] })
            }
            return Promise.resolve(routeList);
        })
    }
    //get course batch Data
    getCourseBatch(companyCode, batchNo) {
        return axios.get(`${this.domain}/course-list-batch?companyCode=` + companyCode + `&batchNumber=` + batchNo, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }).then(res => {
            var courseList = []
            for (var i = 0; i < res.data.length; i++) {
                courseList.push({ "value": res.data[i]['courseNumber'], "label": res.data[i]['courseName'], "courseStartDate": res.data[i]['courseStartDate'] })
            }
            return Promise.resolve(courseList);
        })
    }
    //get batch Data
    getBatch(companyCode) {
        return axios.get(`${this.domain}/batch?companyCode=` + companyCode, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }).then(res => {
            //console.log(res.data)
            var batchList = []
            for (var i = 0; i < res.data.length; i++) {
                batchList.push({ "value": res.data[i]['batchNumber'], "label": res.data[i]['batchNumber'] })
            }
            return Promise.resolve(batchList);
        })
    }
    //get company list
    getCompanyList(companyCode = null) {
        let url = `${this.domain}/company`;
        if (companyCode) {
            url = `${this.domain}/company?companyCode=${companyCode}`
        }
        return axios.get(`${url}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }).then(res => {
            var companies = []
            for (var i = 0; i < res.data.length; i++) {
                if (res.data[i]['Id'] !== "" && res.data[i]['Id'] !== "0") {
                    var optName = res.data[i]['Id'] + " - " + res.data[i].Name
                    companies.push({ 'value': res.data[i]['Id'], 'label': optName })
                }
            }
            return Promise.resolve(companies);
        })
    }
    //get employee list
    getEmployeeList(companyCode, batchNumber, gdprCheck = "") {
        var params = "CompanyCode=" + companyCode;
        if (batchNumber && batchNumber !== "0") {
            params = params + "&batchno=" + batchNumber
        }
        if (gdprCheck && gdprCheck !== "") {
            params = params + "&acceptedGDPR=" + gdprCheck
        }
        // return axios.get(`${this.domain}/getEmployee.php?` + params)
        return axios.get(`${this.domain}/employee?` + params, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })
            .then(res => {
                return Promise.resolve(res.data);
            })
    }


    //get employee list
    getEmployeeListPaginated(companyCode, page) {
        var params = "CompanyCode=" + companyCode;
        if (page) {
            params = params + "&page=" + page;
        }
        // return axios.get(`${this.domain}/getEmployee.php?` + params)
        return axios.get(`${this.domain}/employee-paginated?` + params, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })
            .then(res => {
                return Promise.resolve(res.data);
            });
    }

    getEmployeeListSearchPaginated(companyCode, page, search = null) {
        var params = "CompanyCode=" + companyCode;
        if (page) {
            params = params + "&page=" + page;
        }
        if (search) {
            params = params + "&search=" + search;
        }
        // return axios.get(`${this.domain}/getEmployee.php?` + params)
        return axios.get(`${this.domain}/employee-paginated?` + params, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })
            .then(res => {
                return Promise.resolve(res.data);
            });
    }

    //get course list
    getCourseList(companyCode, batchNumber = 0) {
        let params = "companyCode=" + companyCode;
        if (batchNumber !== 0) {
            params = params + "&batchNumber=" + batchNumber
        }
        return axios.get(`${this.domain}/course-list-batch?` + params, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }).then(res => {
            let courseList = []
            let j = 0;
            for (var i = 0; i < res.data.length; i++) {
                j = i + 1
                let data = res.data[i]
                data['i_d'] = j;
                courseList.push(data)
            }
            return Promise.resolve(courseList);
        })
    }
    //get course list
    getCourseDetails(companyCode, courseNumber) {
        // Get a token from api server using the fetch api
        return this.fetch(`${this.domain}/employee-course-registered-all?companyCode=` + companyCode + `&courseNumber=` + courseNumber, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            method: 'get'
        }).then(res => {
            var registeredUsers = []
            for (var i = 0; i < res.registered.length; i++) {
                registeredUsers.push(res.registered[i]['userId'])
            }
            var availableUsers = []
            for (var ii = 0; ii < res.availableToRegister.length; ii++) {
                if (registeredUsers.indexOf(res.availableToRegister[ii]['userId']) === -1) {
                    availableUsers.push(res.availableToRegister[ii])
                }
            }
            res.availableToRegister = availableUsers;
            return Promise.resolve(res);
        })
    }
    addEmpCourse(userId, companyCode, courseNumber) {
        return axios.post(`${this.domain}/add-employee-course`, {
            userId, companyCode, courseNumber
        }, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }).then(res => {
            return Promise.resolve(res);
        })
    }
    deleteEmpCourse(userId, companyCode, courseNumber) {
        return axios.post(`${this.domain}/remove-employee-course`, {
            userId, companyCode, courseNumber
        }, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }).then(res => {
            return Promise.resolve(res);
        })
    }
    setCompanyCode(companyCode) {
        // Saves user token to localStorage
        localStorage.setItem('company_code', companyCode)
    }
    getCompanyCode() {
        return localStorage.getItem('company_code')
    }
    setCompanyName(companyName) {
        // Saves user token to localStorage
        localStorage.setItem('company_name', companyName)
    }
    getCompanyName() {
        return localStorage.getItem('company_name')
    }
    setAccessLevel(access_level) {
        // Saves user token to localStorage
        localStorage.setItem('access_level', access_level)
    }
    getAccessLevel() {
        return localStorage.getItem('access_level')
    }
    //get Overview for company	
    getOverView(companyCode) {
        return this.fetch(`${this.domain}/company-overview?companyCode=` + companyCode, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }).then(res => {
            return Promise.resolve(res);
        })
    }

    // get leaderboard weekly
    getLeaderboard(companyCode) {
        return axios.get(`${this.domain}/leaderboard-company?withNewUsers=true&companyCode=${companyCode}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        })
    }

    // get leaderboard today
    getLeaderboardToday(companyCode) {
        return axios.get(`${this.domain}/leaderboard-company/today?withNewUsers=true&companyCode=${companyCode}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        })
    }

    getDailyGoalLog(userId) {
        return axios.get(`${this.domain}/cms/daily-goal-log?userId=${userId}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        })
    }

    createACertificate({ userId, courseNo }) {
        return axios.post(`${this.domain}/create-certificate`, {
            userId, courseNo
        }, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        })
    }

    updateCourseSubscriptionExpiresDate({ userId, courseNo, subscriptionExpiresDate }) {
        return axios.post(`${this.domain}/employee-course-update-subscription-expires`, {
            userId, courseNo, subscriptionExpiresDate
        }, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        })
    }

    // getCourseRegistrationReport
    getCourseRegistrationReport(courseNo, lastXDays = 7) {
        return axios.get(`${this.domain}/employee-course-registeration-report?courseNo=${courseNo}&lastXDays=${lastXDays}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        })
    }

    // getCompanyRegistrationReport
    getCompanyRegistrationReport(companyCode, lastXDays = 7) {
        return axios.get(`${this.domain}/employee-company-registeration-report?companyCode=${companyCode}&lastXDays=${lastXDays}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        })
    }

    // getCompanyActivationReport
    getCompanyActivationReport(companyCode, lastXDays = 7) {
        return axios.get(`${this.domain}/employee-company-activation-report?companyCode=${companyCode}&lastXDays=${lastXDays}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        })
    }

    // getCompanyActivationReport
    getCompanyRegActReport(companyCode, startDate, endDate) {
        return axios.get(`${this.domain}/employee-company-regact-report?companyCode=${companyCode}&startDate=${startDate}&endDate=${endDate}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        })
    }

    // getCompanyActivationReport
    getProgramData(company_code = 0, program_id = 1) {
        return axios.get(`${this.domain}/company/${company_code}/program/${program_id}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        })
    }

    getProgramForUserId(program_id = 1, userId) {
        return axios.get(`${this.domain}/program/${program_id}/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });

    }

    getCompanyCohorts(company_code = 0) {
        return axios.get(`${this.domain}/cohorts-by-company?company_code=` + company_code, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }


    getCompanyCohortSingle(cohort_id = 0,) {
        return axios.get(`${this.domain}/cohorts-by-company/${cohort_id}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }
    getCompanyCohortSingleReport(cohort_id = 0, startDate = '', endDate = '') {
        return axios.get(`${this.domain}/cohorts-by-company/report/${cohort_id}?startDate=${startDate}&endDate=${endDate}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }



    getCompanyCohortUserAttempts(userId = "") {
        return axios.get(`${this.domain}/interview/user-prev-attempts/all?email=` + userId, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }

    getUserMistakesByCohort(cohort_id, date) {
        return axios.get(`${this.domain}/user-mistakes-report-by-cohort/${cohort_id}?date=${date}`, {
            headers: {
                'Accept': "application/json",
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }

    /**
     * For one user
     * @param {*} cohort_id 
     * @param {*} date 
     * @returns 
     */
    getUserMistakesDetailByCohort(cohort_id, date, userId) {
        return axios.get(`${this.domain}/user-mistakes-report-by-cohort/${cohort_id}/user/${userId}?date=${date}`, {
            headers: {
                'Accept': "application/json",
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }

    /**
     * For one user
     * @param {*} cohort_id 
     * @param {*} date 
     * @returns 
     */
    getUserTimeLogReportByCohort(cohort_id, date, userId) {
        return axios.get(`${this.domain}/user-time-report-by-cohort/${cohort_id}/user/${userId}?date=${date}`, {
            headers: {
                'Accept': "application/json",
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }

    getUserPlacementMistakesByCohort(cohort_id, date) {
        return axios.get(`${this.domain}/user-placement-mistakes-report-by-cohort/${cohort_id}?date=${date}`, {
            headers: {
                'Accept': "application/json",
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }

    /**
     * For one user
     * @param {*} cohort_id 
     * @param {*} date 
     * @returns 
     */
    getUserPlacementMistakesDetailByCohort(cohort_id, date, userId) {
        return axios.get(`${this.domain}/user-placement-mistakes-report-by-cohort/${cohort_id}/user/${userId}?date=${date}`, {
            headers: {
                'Accept': "application/json",
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }

    getCohortDetail(cohort_id = 0) {
        return axios.get(`${this.domain}/cohort-detail/` + cohort_id, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }
    addCompanyPracticeSet(payload) {
        return axios.post(`${this.domain}/company-practice-set`, payload, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }
    addCompanyPracticeSetQuetion(practiceSetId, payload) {
        return axios.post(`${this.domain}/company-practice-set/${practiceSetId}/question`, payload, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }
    updateCompanyPracticeSetQuetion(practiceSetId, payload, practiceQuestionId) {
        return axios.post(`${this.domain}/company-practice-set/${practiceSetId}/question/${practiceQuestionId}`, payload, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }
    deleteCompanyPracticeSetQuetion(practiceSetId, practiceQuestionId) {
        return axios.delete(`${this.domain}/company-practice-set/${practiceSetId}/question/${practiceQuestionId}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }

    getUserCohortDetail(cohort_id = 0, userId = "") {
        return axios.get(`${this.domain}/user-cohort-detail/` + cohort_id + "/" + userId, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }

    getProgramsList() {
        return axios.get(`${this.domain}/all-programs`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }

    saveCohort(cohort = {}) {
        return axios.post(`${this.domain}/cohorts`, cohort, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }

    registerUsersToCohortFromCSV(cohort_id = 0, csv) {
        const data = new FormData();
        data.append('cohort_id', cohort_id);
        data.append('csv', csv, csv.filename);
        return axios.post(`${this.domain}/register-cohort-using-csv`, data, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }

    getAllPracticeSets() {
        // practice-sets/all
        return axios.get(`${this.domain}/practice-sets/all`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }

    addPracticeSetsToCohort(cohortId, practiceSetIds = []) {
        // practice-sets/all
        return axios.post(`${this.domain}/cohort/add-practice-set`, {
            cohortId,
            practiceSetIds
        }, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });

    }

    removePracticeSetFromCohort(cohortId, practiceSetId) {
        // practice-sets/all
        return axios.delete(`${this.domain}/cohort/${cohortId}/remove-practice-set/${practiceSetId}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });

    }

    getCohortPracticeSets(cohort_id = 0) {
        return axios.get(`${this.domain}/cohort/${cohort_id}/get-practice-sets`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }
    getCohortPracticeSetsQuestions(practice_id = 0) {
        return axios.get(`${this.domain}/company-practice-set/${practice_id}/question`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        }).catch(e => {

        })
    }

    sendLastPlacementTestResultEmail(userId) {
        return axios.get(`${this.domain}/user/send-last-placement-test-result/${userId}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
        }
        ).then(res => {
            return res.data;
        });
    }

    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        /* if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        } */

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}