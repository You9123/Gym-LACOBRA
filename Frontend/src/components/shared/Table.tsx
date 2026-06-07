interface TableProps<T>{

    data:T[];

    columns:{
        header:string;

        accessor:keyof T;

    }[];

}

function Table<T>({
    data,
    columns
}:TableProps<T>){

    return(

        <div
            className="
                overflow-x-auto
                rounded-2xl
                border
                border-zinc-800
            "
        >

            <table
                className="
                    w-full
                    bg-zinc-900
                "
            >

                <thead>

                    <tr
                        className="
                            bg-zinc-800
                        "
                    >

                        {

                            columns.map(col=>(

                                <th
                                    key={
                                        String(
                                            col.accessor
                                        )
                                    }
                                    className="
                                        p-4
                                        text-left
                                        text-cyan-400
                                    "
                                >

                                    {col.header}

                                </th>

                            ))

                        }

                    </tr>

                </thead>

                <tbody>

                    {

                        data.map(
                            (row,index)=>(

                            <tr
                                key={index}
                                className="
                                    border-t
                                    border-zinc-800
                                "
                            >

                                {

                                    columns.map(col=>(

                                        <td
                                            key={
                                                String(
                                                    col.accessor
                                                )
                                            }
                                            className="
                                                p-4
                                                text-zinc-300
                                            "
                                        >

                                            {

                                                String(
                                                    row[
                                                        col.accessor
                                                    ]
                                                )

                                            }

                                        </td>

                                    ))

                                }

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default Table;