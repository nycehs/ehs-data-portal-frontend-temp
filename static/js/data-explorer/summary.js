const renderTable = () => {
                        
  const groupColumnYear = 0
  const groupColumnGeo = 1;
  const groupId = 0

  const filteredTableData = joinedAqData.objects().filter(d =>
      selectedSummaryYears.includes(d.Time) && selectedSummaryGeography.includes(d.GeoType)
  )
  const filteredTableAqData = aq.from(filteredTableData)

  console.log('==========================================================================')
  console.log('RENDER TABLE DATA - Filtered Data: ', filteredTableAqData)

  // call function to show table
  document.getElementById('summary-table').innerHTML = filteredTableAqData.toHTML(); // print dataTable to HTML
  document.querySelector('#summary-table table').id = "tableID"
  document.querySelector('#summary-table table').className = "cell-border stripe compact" // this gives the table an ID (table code generated by Arquero)

  $('#tableID').DataTable({
      scrollY: 500,
      scrollCollapse: true,
      searching: false,
      paging: false,
      bInfo: false,
      "orderFixed": [ 5, 'asc' ],
      "columnDefs": [
          { "visible": false, "targets": [0, 1, 2, 3, 5 ]}
      ],
      "createdRow": function ( row, data, index ) {
          console.log('RENDER TABLE FUNCTION - CreatedRow')
          const time    = data[0];
          const geoType = data[1];
          if (time && geoType) {
              row.setAttribute(`data-group`, `${time}-${geoType}`)
              row.setAttribute(`data-year`, `${time}`);
          }
      },
      "drawCallback": function ( settings ) {
          console.log('RENDER TABLE FUNCTION - DrawCallback')
          const api = this.api();
          const data = api.rows( {page:'current'} ).data()
          const rows = api.rows( {page:'current'} ).nodes();
          const totaleColumnsCount = api.columns().count()
          const visibleColumnsCount =  totaleColumnsCount - 4;

          var last = null;
          var lastYr = null;
          const createGroupRow = (groupColumn, lvl) => {
              api.column(groupColumn, {page:'current'} ).data().each( function ( group, i ) {
                  const year = data[i][0]
                  const groupName = `${year}-${group}`
                  if ( last !== group || lastYr !== year ) {
                      $(rows).eq( i ).before(
                          `<tr class="group"><td colspan="${visibleColumnsCount}" data-year="${year}" data-group="${group}" data-group-level="${lvl}"> ${group}</td></tr>`
                      );
                      last = group;
                      lastYr = year
                  }
              });
          }

          createGroupRow(groupColumnYear, 0);
          createGroupRow(groupColumnGeo, 1);
          handleToggle();
      }
  })
}